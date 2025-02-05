#!/bin/bash

set -eo pipefail

SRCROOT="$(cd "$(dirname "$0")/../.." && pwd)"

if [ "$1" ]; then
  PROJECT=$1
  for x in "$SRCROOT/products/$(uname)/$(uname -m)/$PROJECT/"v*; do
    PREFIX="$x"
  done
elif [ ! "$PROJECT" -o ! "$PREFIX" ]; then
  echo "Usage: $0 <project>"
  exit 1
fi

case $(uname) in
Linux)
  cd "$(mktemp -d -t pkgx.XXXXXX)"
  mkdir -p .pkgx
  cp -r $SRCROOT/bin/toolchain .pkgx/bin
  cd .pkgx/bin
  # these must be symlinks or they don’t behave like eg. gcc
  ln -s "$(./pkgx +llvm.org -- which clang)" cc
  ln -s "$(./pkgx +llvm.org -- which clang)" gcc
  ln -s "$(./pkgx +llvm.org -- which clang++)" c++
  ln -s "$(./pkgx +llvm.org -- which clang++)" g++
  ln -s "$(./pkgx +llvm.org -- which clang-cpp)" cpp
  ln -s "$(./pkgx +llvm.org -- which ld.lld)" ld
  ln -s "$(./pkgx +llvm.org -- which ld.lld)" ld.lld
  ln -s "$(./pkgx +llvm.org -- which lld-link)" lld-link
  ln -s "$(./pkgx +llvm.org -- which llvm-ar)" ar
  ln -s "$(./pkgx +llvm.org -- which llvm-as)" as
  ln -s "$(./pkgx +llvm.org -- which llvm-nm)" nm
  ln -s "$(./pkgx +llvm.org -- which llvm-objcopy)" objcopy
  ln -s "$(./pkgx +llvm.org -- which llvm-ranlib)" ranlib
  ln -s "$(./pkgx +llvm.org -- which llvm-readelf)" readelf
  ln -s "$(./pkgx +llvm.org -- which llvm-strings)" strings
  ln -s "$(./pkgx +llvm.org -- which llvm-strip)" strip
  cd ../..
  ;;
Darwin)
  cd "$(mktemp -d  /tmp/pkgx.XXXXXX)"
  cd "$(realpath .)"  # resolves the symlink and stops deno complaining about writes to a slightly different directory
  mkdir -p .pkgx/bin
  cp /usr/local/bin/pkgx .pkgx/bin
esac

for x in "$SRCROOT"/projects/$PROJECT/*; do
  if [ $(basename $x) = 'package.yml' ]; then
    true
  elif [[ $x == *.ts ]]; then
    true
  else
    cp "$x" .
  fi
done

cat << EoTS > .pkgx/run-test.ts
import check from '$SRCROOT/projects/$PROJECT/test.ts';
import { parse } from "jsr:@std/semver@^1";
import { Path } from 'brewkit';
const prefix = new Path(Deno.args[0]);
const version = parse(prefix.basename());
await check(prefix, version);
EoTS

echo "{\"imports\": {\"brewkit\": \"$SRCROOT/lib/mod.ts\"}}" > .pkgx/deno.json

deno="$(.pkgx/bin/pkgx +deno^2 -- which deno)"

export PATH="/usr/bin:/bin:/usr/sbin:/sbin:$PWD/.pkgx/bin"

set -a
eval "$(PKGX_PANTRY_DIR="$SRCROOT/builds/pantry" PKGX_DIST_URL="https://dist.pkgx.dev/v2" PKGX_DIR="$SRCROOT/products/$(uname)/$(uname -m)" pkgx +$PROJECT)"
set +a

if [ "$GITHUB_ACTIONS" ]; then
  echo "::group::env"
  env
  echo "::endgroup::"
fi

"$deno" \
  run \
  --quiet \
  --allow-read="$PWD" \
  --allow-run \
  --allow-env=HOME,TMP,TEMP,TMPDIR,TEMPDIR,PWD \
  --allow-write="$PWD" \
  --allow-net \
  --ext=ts \
  .pkgx/run-test.ts \
  "$PREFIX"

rm -rf "$PWD"
