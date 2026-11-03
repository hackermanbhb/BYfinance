#!/bin/zsh
cd "$(dirname "$0")" || exit 1
python3 execution/sure_local.py start && open http://localhost:3040
