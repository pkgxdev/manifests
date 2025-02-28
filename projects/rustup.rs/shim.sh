#!/bin/sh
if [ ! -f "$HOME/.cargo/env" ]; then
  # remove ourselves from PATH to prevent spurious warning from rustup-init
  D="$(dirname "$0")"
  SANITIZED_PATH=$(echo "$PATH" | awk -v RS=':' -v ORS=':' '$0 != "'"$D"'"' | sed 's/:$//')
  PATH="$SANITIZED_PATH" "$D/rustup-init" -y --no-modify-path
  exit_code=$?
  if [ $exit_code -ne 0 ]; then
    exit $exit_code
  fi
fi
source ~/.cargo/env
exec $(basename "$0") "$@"
