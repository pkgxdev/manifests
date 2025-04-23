import { BuildOptions, unarchive, run, env_include } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://download.gnome.org/sources/gdk-pixbuf/${version.marketing}/gdk-pixbuf-${version}.tar.xz`);
  env_include("gnome.org/gobject-introspection");
//   if test {{ hw.platform }} == linux; then
//     #FIXME so linux build finds the shared-mime-info cache
//     export XDG_DATA_DIRS="$XDG_DATA_DIRS:/usr/share"
//   fi
  run`meson
      setup bld
      --buildtype=release
      --prefix=${prefix}
      --libdir=${prefix}/lib
      -Dman=false`;
  run`ninja -C bld install`;
}
