#!/usr/bin/env bash
# Einmalig ausführen: Bytecat-Key in macOS Keychain laden (Passphrase eingeben)
set -euo pipefail
KEY="${HOME}/.ssh/id_ed25519_bytecat"
if [[ ! -f "$KEY" ]]; then
  echo "Key nicht gefunden: $KEY" >&2
  exit 1
fi
ssh-add --apple-use-keychain "$KEY"
echo "Bytecat-Key geladen. Test:"
ssh -T git@git.bytecat.eu || true