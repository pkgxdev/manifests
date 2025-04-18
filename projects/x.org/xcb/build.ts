import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://xcb.freedesktop.org/dist/libxcb-{{version.raw}}.tar.gz`);
  // dependencies:
//   freedesktop.org/pkg-config: ^0.29
//   python.org: ~3.11
//   x.org/protocol/xcb: ^1
//   gnu.org/patch: '*'
// script:
//   - run: patch -p1 <props/configure.patch
//     if: <1.16
//   - ./configure $ARGS
//   - 'make --jobs ${navigator.hardwareConcurrency} install'
//   - run: rm *.la
//     working-directory: '${{prefix}}/lib'
// env:
//   SHELF: '${{pkgx.prefix}}/x.org'
//   ARGS:
//     - '--prefix="{{prefix}}"'
//     - '--sysconfdir="$SHELF"/etc'
//     - '--localstatedir="$SHELF"/var'
//     - '--enable-dri3'
//     - '--enable-ge'
//     - '--enable-xevie'
//     - '--enable-xprint'
//     - '--enable-selinux'
//     - '--disable-silent-rules'
//     - '--enable-devel-docs=no'
//     - '--with-doxygen=no'
}