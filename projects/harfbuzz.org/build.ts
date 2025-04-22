import { env_include, BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://github.com/harfbuzz/harfbuzz/archive/${version}.tar.gz`);

  env_include("gnome.org/gobject-introspection");

  Deno.env.set("CFLAGS", '-fPIC');
  Deno.env.set("CXXFLAGS", '-fPIC');
  Deno.env.set("LDFLAGS", '-pie');

  run`meson setup bld
        --prefix=${prefix}
        --libdir=${prefix}/lib
        --buildtype=release
        -Dcairo=enabled
        -Dcoretext=enabled
        -Dfreetype=enabled
        -Dglib=enabled
        -Dgraphite=enabled
        -Dtests=disabled
        `;
  run`ninja -C bld --verbose`;
  run`ninja -C bld install`;
}
