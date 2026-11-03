#!/usr/bin/env python3
"""Repeatable Sure lifecycle. Never prints secrets or deletes persistent volumes."""
import argparse
import datetime
import os
from pathlib import Path
import secrets
import subprocess
import uuid
import time
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "sure-local"
ENV = APP / ".env.local"


def compose(*args, **kwargs):
    return subprocess.run(
        ["docker", "compose", "--env-file", str(ENV), "-f", str(APP / "compose.local.yml"), *args],
        cwd=APP, check=True, **kwargs
    )


def configure():
    if ENV.exists():
        return
    sha = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=APP, text=True).strip()
    values = {
        "SECRET_KEY_BASE": secrets.token_hex(64),
        "POSTGRES_PASSWORD": secrets.token_hex(32),
        "SURE_LOCAL_MODE": "true",
        "SURE_LOCAL_ACCESS_KEY": secrets.token_hex(48),
        "SURE_LOCAL_USER_ID": str(uuid.uuid4()),
        "SURE_UPSTREAM_SHA": sha,
        "ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY": secrets.token_hex(16),
        "ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY": secrets.token_hex(16),
        "ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT": secrets.token_hex(16),
    }
    fd = os.open(ENV, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "w") as stream:
        stream.write("".join(f"{key}={value}\n" for key, value in values.items()))
    print("Private local configuration created.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["configure", "setup", "start", "stop", "status", "rebuild", "backup"])
    command = parser.parse_args().command
    configure()
    if command == "configure":
        return
    if command in ("setup", "rebuild"):
        compose("build", "web")
    if command == "setup":
        compose("up", "-d", "db", "redis")
        compose("run", "--rm", "web", "bin/rails", "db:prepare")
        compose("run", "--rm", "web", "bin/rails", "runner", "local/bootstrap.rb")
    if command in ("setup", "start", "rebuild"):
        compose("up", "-d", "--no-build")
        for attempt in range(60):
            try:
                with urllib.request.urlopen("http://localhost:3040/up", timeout=2) as response:
                    if response.status == 200:
                        break
            except (OSError, urllib.error.URLError):
                time.sleep(1)
        else:
            raise SystemExit("Sure did not become ready. Check Docker Desktop and run the status command.")
        print("Sure: http://localhost:3040 — local to this Mac")
    elif command == "stop":
        compose("stop")
    elif command == "status":
        compose("ps")
    elif command == "backup":
        stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        target = APP / "local" / "backups" / stamp
        target.mkdir(parents=True, mode=0o700)
        os.chmod(target, 0o700)
        # Pause app writers so the database, uploads and keys form one snapshot.
        compose("stop", "gateway", "web", "worker")
        try:
            with (target / "database.dump").open("wb") as stream:
                compose("exec", "-T", "db", "pg_dump", "-U", "sure_local", "-Fc", "sure_local", stdout=stream)
            with (target / "uploads.tar.gz").open("wb") as stream:
                compose("run", "--rm", "--no-deps", "-T", "--entrypoint", "tar", "web", "czf", "-", "-C", "/rails/storage", ".", stdout=stream)
            (target / "configuration.env").write_bytes(ENV.read_bytes())
            (target / "compose.local.yml").write_bytes((APP / "compose.local.yml").read_bytes())
            for path in target.iterdir():
                os.chmod(path, 0o600)
        finally:
            compose("up", "-d", "--no-build")
        print(f"Private backup saved: {target}")


if __name__ == "__main__":
    main()
