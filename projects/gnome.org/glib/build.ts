import { env_include, BuildOptions, unarchive, run, Path, inreplace } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://download.gnome.org/sources/glib/${version.major}.${version.minor}/glib-${version}.tar.xz`);

  env_include("mesonbuild.com");

  try {
    env_include("gnome.org/gobject-introspection");
  } catch {
    console.error("::warning::rebuild this after building gobject-introspection!");
  }

  run`meson out
        --prefix=${prefix}
        --libdir=${prefix}/lib
        --wrap-mode=nofallback
        --buildtype=release
        -Dtests=false
      # -Dintrospection=enabled`;
  Path.cwd().join("out").cd();
  run`ninja install`;

  inreplace(
    prefix.bin.join("glib-gettextize"),
    `prefix=${prefix}`,
    'prefix="$(cd "$(dirname "$0")/.." && pwd)"');
  inreplace(
    prefix.bin.join("glib-gettextize"),
    prefix.string,
    '"$prefix"');

  // weird tmp dir ends up in the install
  prefix.join("share/gdb/auto-load/tmp").rm('rf');
}
