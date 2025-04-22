import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.x.org/archive/individual/lib/libXScrnSaver-${version}.tar.gz`);
  // script:
//   - ./configure $ARGS
//   - 'make --jobs ${navigator.hardwareConcurrency} install'
//   - run: 'find . -name "*.la" -exec rm -f {} \;'
//     working-directory: '${prefix}/lib'
// env:
//   SHELF: '${{pkgx.prefix}}/x.org'
//   ARGS:
//     - '--prefix="${prefix}"'
//     - '--sysconfdir="$SHELF"/etc'
//     - '--localstatedir="$SHELF"/var'
//     - '--enable-spec=no'
}