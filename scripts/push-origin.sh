#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! ssh-add -l 2>/dev/null | grep -q id_ed25519_bytecat; then
  echo "Bytecat-Key nicht im SSH-Agent — lade Key…"
  ssh-add --apple-use-keychain "${HOME}/.ssh/id_ed25519_bytecat"
fi

git push -u origin main "$@"