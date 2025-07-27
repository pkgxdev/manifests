#!/bin/sh

if [ $0 == "rustup" && $1 == "init" ]; then
  shift
  exec pkgx rustup-init "$@"
fi

#TODO support CARGO_HOME and RUSTUP_HOME env vars

if [ ! -f "$HOME/.cargo/bin/rustup" ]; then
  echo "a \`rustup\` toolchain has not been installed" >&2
  echo "run: \`rustup init\`" >&2
  exit 3
fi

source ~/.cargo/env

exec ~/.cargo/bin/"$0" "$@"
