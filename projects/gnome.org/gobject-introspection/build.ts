import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://download.gnome.org/sources/gobject-introspection/{{version.major}}.{{version.minor}}/gobject-introspection-{{version}}.tar.xz`);
  // dependencies:
//   mesonbuild.com: ^1.2
//   ninja-build.org: 1
// working-directory: build
// script:
//   - 'meson .. --prefix={{prefix}} --libdir={{prefix}}/lib --buildtype=release'
//   - ninja -v
//   - ninja install
//   - run: >-
//       sed -i 's|env {{deps.python.org.prefix}}/bin/python|env python|'
//       g-ir-annotation-tool g-ir-scanner
//     working-directory: '${{prefix}}/bin'
// env:
//   CC: clang
}