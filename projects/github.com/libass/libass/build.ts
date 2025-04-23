import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/libass/libass/archive/refs/tags/${version}.tar.gz`);
  // dependencies:
//   gnu.org/autoconf: 2
//   gnu.org/automake: 1
//   gnu.org/libtool: 2
//   freedesktop.org/pkg-config: '*'
// script: |
//   ./autogen.sh
//   ./configure $ARGS
//   make install
// env:
//   ARGS:
//     - '--disable-dependency-tracking'
//     - '--prefix=${prefix}'
//   darwin:
//     ARGS:
//       - '--disable-fontconfig'
}