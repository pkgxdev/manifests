import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/besser82/libxcrypt/releases/download/v{{version}}/libxcrypt-{{version}}.tar.xz`);
  // dependencies:
//   freedesktop.org/pkg-config: ~0.29
//   perl.org: '*'
// script: |
//   ./configure $ARGS
//   make --jobs ${navigator.hardwareConcurrency} install
// env:
//   ARGS:
//     - '--prefix="{{prefix}}"'
//     - '--disable-valgrind'
//     - '--disable-symvers'
//     - '--disable-failure-tokens'
}