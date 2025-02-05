#!/bin/bash

set -eo pipefail

if [ "$GITHUB_ACTIONS" ]; then
 echo "::group::prep"
fi

SRCROOT="$(cd "$(dirname "$0")"/../.. && pwd)"
PROJECT="$1"

if [ ! -f "$SRCROOT/projects/$PROJECT/package.yml" ]; then
  echo "package not found" >&2
  exit 1
fi

case $(uname) in
Linux)
  cd "$(mktemp -d -t pkgx.XXXXXX)"
  mkdir .pkgx
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
  jq="pkgx jq"
  deno="$(pkgx +deno^2 -- which deno)"
  deno_exec="$deno"
  ./pkgx +msgfmt >/dev/null  #FIXME remove this, is temporary to work around pkgx 2.2.0 bug
  cd ../..
  ;;

Darwin)
  cd "$(mktemp -d /tmp/pkgx.XXXXXX)"
  mkdir -p .pkgx/bin
  cp /usr/local/bin/pkgx .pkgx/bin
  deno="$(/usr/local/bin/pkgx +deno^2 -- which deno)"
  # prevent build scripts from dipping into Homebrew or /usr/local
  cat <<EoSB > .pkgx/sandbox.sb
(version 1)
(allow default)
(deny file-read* (subpath "/opt/homebrew"))
(deny file-read* (subpath "/usr/local"))
EoSB
  deno_exec="sandbox-exec -f .pkgx/sandbox.sb $deno"
  jq="$(which jq)"
  ;;
esac

echo "import versions from '$SRCROOT/projects/$PROJECT/versions.ts';" > .pkgx/run-build.ts
echo "import build from '$SRCROOT/projects/$PROJECT/build.ts';" >> .pkgx/run-build.ts
cat "$SRCROOT/lib/build-template.ts" >> .pkgx/run-build.ts
echo "{\"imports\": {\"brewkit\": \"$SRCROOT/lib/mod.ts\", \"fixup\": \"$SRCROOT/lib/fixup.ts\" }}" > .pkgx/deno.json

# sanitize PATH before adding deps
export PATH="$PWD/.pkgx/bin:/usr/bin:/bin:/usr/sbin:/sbin"

"$SRCROOT/bin/pkg" convert

eval "$(PATH="$(dirname "$deno")" PKGX_PANTRY_DIR="$SRCROOT/builds/pantry" PKGX_DIST_URL="https://dist.pkgx.dev/v2" PKGX_DIR="$PWD/.pkgx" $SRCROOT/bin/private/deps-env.ts $PROJECT)"

# we need full allow-read and write because Deno.symlink sucks
# TODO make our own implementation

# we need full --allow-env to allow build scripts to set environment
# TODO they can do this some other way!

if [ "$GITHUB_ACTIONS" ]; then
  echo "::endgroup::"
fi

$deno_exec run \
  --quiet \
  --allow-read \
  --allow-run \
  --allow-env \
  --allow-write \
  --allow-net \
  --ext=ts \
  .pkgx/run-build.ts \
  "$PROJECT" \
  "$PWD" \
  "$SRCROOT/projects/$PROJECT"

PROJECT="$(cat .pkgx/build-receipt.json | $jq -r .project)"
VERSION="$(cat .pkgx/build-receipt.json | $jq -r .version)"
PLATFORM="$(uname)/$(uname -m)"

if [ -f "$GITHUB_ENV" ]; then
  echo "VERSION=$VERSION" >> $GITHUB_ENV
  echo "PROJECT=$PROJECT" >> $GITHUB_ENV
  echo "PREFIX=$SRCROOT/products/$PLATFORM/$PROJECT/v$VERSION" >> $GITHUB_ENV
  echo "PLATFORM=$PLATFORM" >> $GITHUB_ENV

  case "$(uname)/$(uname -m)" in
    Linux/x86_64) echo "DIST_PLATFORM=linux/x86-64" >> $GITHUB_ENV;;
    Darwin/x86_64) echo "DIST_PLATFORM=darwin/x86-64" >> $GITHUB_ENV;;
    Linux/arm64|Linux/aarch64) echo "DIST_PLATFORM=linux/aarch64" >> $GITHUB_ENV;;
    Darwin/arm64) echo "DIST_PLATFORM=darwin/aarch64" >> $GITHUB_ENV;;
  esac
fi

rm -rf "$SRCROOT/products/$PLATFORM/$PROJECT/v$VERSION"
mkdir -p "$SRCROOT/products/$PLATFORM/$PROJECT"
mv "$PWD/.pkgx/$PROJECT"/* "$SRCROOT/products/$PLATFORM/$PROJECT"

rm -rf "$SRCROOT/builds/$PLATFORM/$PROJECT/v$VERSION"
mkdir -p "$SRCROOT/builds/$PLATFORM/$PROJECT"
mv "$PWD" "$SRCROOT/builds/$PLATFORM/$PROJECT/v$VERSION"
mv "$SRCROOT/builds/$PLATFORM/$PROJECT/v$VERSION/.pkgx/build-receipt.json" "$SRCROOT/builds/$PLATFORM/$PROJECT/v$VERSION"
rm -rf "$SRCROOT/builds/$PLATFORM/$PROJECT/v$VERSION/.pkgx"
