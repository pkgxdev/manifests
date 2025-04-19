import { BuildOptions, unarchive, run, env_include } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://download.gnome.org/sources/pango/${version.marketing}/pango-${version}.tar.xz`);

  env_include("gnome.org/gobject-introspection");

  run`meson setup bld
        -Dcairo=enabled
        -Dfontconfig=enabled
        -Dfreetype=enabled
        --buildtype=release
        --prefix=${prefix}
        --libdir=${prefix}/lib
        `;
  run`ninja -C bld install`;
}
