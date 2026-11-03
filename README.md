# Personal finance — Sure on this Mac

Open **http://localhost:3040**. This project now runs the real open-source [Sure](https://github.com/we-promise/sure) finance app, with a refined Cyberpunk dark theme. Sure's existing light mode is available in Settings → Appearance. The checkout is pinned to upstream commit `35563c90859a35c600c178a99ded09d3c31c4fca`.

Docker Desktop must be running. From this project folder:

You can also double-click **Start Sure.command** or **Stop Sure.command**.

```sh
python3 execution/sure_local.py start
python3 execution/sure_local.py status
python3 execution/sure_local.py stop
```

First-time setup or rebuilding changes:

```sh
python3 execution/sure_local.py setup
python3 execution/sure_local.py rebuild
```

Setup initializes an empty personal profile once; rerunning it preserves existing accounts and preferences. No demo financial records are loaded. Start by adding a manual account, then add income/spending or import supported files. Bank connections and paid AI services are not configured.

CSV transaction imports are available after adding an account. PDF transaction extraction in this upstream version uses an AI provider and is not configured or verified here. The Statement Vault can retain original uploaded statements separately from importing their transaction rows. Bank sync is also separate and remains unconfigured. Charts and reports will populate when you enter real data.

## Local access and data

Only the gateway publishes a port: `127.0.0.1:3040`. Rails, PostgreSQL and Redis have no published ports and use an internal Docker network without outbound access. The gateway checks the Host header, replaces forwarded headers and injects a private access key. Sure checks that key and uses an ordinary signed session for the single active user identified in `.env.local`. It refuses automatic access if there is more than one user or household. Existing tenancy, account authorization and CSRF protections remain in place. Normal Sure authentication remains available when explicit local mode is disabled; this configuration is intended only for this Mac and must not be exposed through a tunnel or remote proxy. Feedback telemetry and external provider credentials are disabled. AI integration is deferred; the existing Ollama installation is untouched.

Any person or program with access to this Mac's localhost can open this local profile. Logout does not lock it: opening the dashboard signs in again while local mode is enabled. Do not use this mode on a shared machine.

App source and AGPLv3 license: `sure-local/`. Private keys and the generated profile ID: `sure-local/.env.local` (mode 600). Keep those keys; encrypted stored fields depend on them. Persistent data lives in Docker volumes prefixed `byfinance-sure-local_`: PostgreSQL, uploaded files, and Redis. Stopping containers or Docker does not delete these volumes. Do not run `docker compose down -v` or delete these volumes.

Create a private local backup (briefly pauses app writers):

```sh
python3 execution/sure_local.py backup
```

Backups go to `sure-local/local/backups/<timestamp>/` and contain the database, uploads and encryption/configuration keys. Keep them private. Neither this folder nor the legacy archive is included in Docker build contexts. No offsite backup is configured.

## Previous app

The old React/Express app, its dependencies, credentials, and uncommitted source edits are recoverable in `archive/legacy-app-2026-11-03/`. `ARCHIVE-MANIFEST.json` lists the moved items. Repository history and agent/editor metadata remain at the project root. Nothing was deleted. Archived files and the separate Sure checkout are ignored by the parent Git repository; Sure retains its own Git history for reviewing local modifications.

## Attribution

Sure is a community fork of Maybe Finance, distributed under AGPLv3. This local customization is based on Sure and Maybe Finance and is not affiliated with or endorsed by Maybe Finance Inc. The upstream LICENSE and attribution remain in `sure-local/`.
