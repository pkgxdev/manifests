import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://gitlab.freedesktop.org/xdg/shared-mime-info/-/archive/${tag}/shared-mime-info-${tag}.tar.bz2`);
//   - run: |
//       sed -i.bak -e '/fdatasync/d' meson.build
//       rm meson.build.bak
//     working-directory: ..
//     if: darwin
  run`meson setup bld --prefix=${prefix} --buildtype=release`;
  run`ninja -C bld install`;
//   - run: ./update-mime-database ../share/mime
//     working-directory: '${prefix}/bin'
// env:
//   CXXFLAGS: $CXXFLAGS -std=c++17 -Wno-reserved-user-defined-literal
//   linux:
//     LDFLAGS: $LDFLAGS -lstdc++fs
}
