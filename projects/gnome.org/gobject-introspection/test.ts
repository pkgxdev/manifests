import { run } from "brewkit";

export default async function () {
  // dependencies:
//   gnome.org/glib: 2
//   pcre.org: 8
//   git-scm.org: 2
//   gnu.org/sed: '*'
//   freedesktop.org/pkg-config: ^0.29
//   linux:
//     gnu.org/make: '*'
//     llvm.org: '*'
// script:
//   - git clone $FIXTURE test
//   - cd test
//   - git apply ../test_make.diff
//   - run: 'sed -i ''s|(CC)|(CC) -Wl,-rpath,{{pkgx.prefix}}|'' Makefile'
//     if: darwin
//   - make
//   - test -f Tut-0.1.typelib
// env:
//   FIXTURE: 'https://gist.github.com/7a0023656ccfe309337a.git'
//   PKG_CONFIG_PATH: '$PKG_CONFIG_PATH:{{prefix}}/lib/pkgconfig'
//   CC: clang
// 
}