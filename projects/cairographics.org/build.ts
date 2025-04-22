import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://cairographics.org/releases/cairo-${version}.tar.xz`);
  // dependencies:
//   freedesktop.org/pkg-config: ^0.29
//   libexpat.github.io: =2.4.9
//   gnome.org/gobject-introspection: 1
//   gnu.org/libtool: ^2
//   mesonbuild.com: ^1
//   ninja-build.org: ^1

const linux = Deno.build.os === "axlinux" ? `
  -Dxcb=enabled
  -Dxlib=enabled` : '';

  run`meson
        setup bld
        --prefix=${prefix}
        --buildtype=release
        -Dfreetype=enabled
        -Dfontconfig=enabled
        -Dpng=enabled
        -Dglib=enabled
        -Dzlib=enabled
        -Dglib=enabled
        ${linux}
        `;
  run`ninja -C bld`
  run`ninja -C bld install`;
//     if: '>=1.18.0'
//   - 'rm -rf {{prefix}}/share'
//   - run: |
//       mv cairo/* .
//       rmdir cairo
//       ln -s . cairo
//     working-directory: '${prefix}/include'
//   - run: |
//       if [ -d cairo ]; then
//         tmp_dir=cairo
//       else
//         tmp_dir=$(ls)
//       fi
//       mv $tmp_dir/* .
//       rmdir $tmp_dir
//       ln -s . $tmp_dir
//     working-directory: '${prefix}/lib'
// env:
//   ARGS:
//     - '-Dfreetype=enabled'
//     - '-Dfontconfig=enabled'
//     - '-Dpng=enabled'
//     - '-Dglib=enabled'
//     - '-Dxcb=enabled'
//     - '-Dxlib=enabled'
//     - '-Dzlib=enabled'
//     - '-Dglib=enabled'
}