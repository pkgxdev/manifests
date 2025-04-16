import { BuildOptions, unarchive, run, Path } from "brewkit";
import env_include from "../../../brewkit/env-include.ts";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://download.gnome.org/sources/gobject-introspection/${version.marketing}/gobject-introspection-${version}.tar.xz`);
  Path.cwd().join("bld").mkdir().cd();
  Deno.env.set("CC", "clang");
  env_include("gnu.org/bison^3 github.com/westes/flex");
  run`pkgx meson .. --prefix=${prefix} --libdir=${prefix}/lib --buildtype=release`;
  run`ninja`;
  run`ninja install`;
}
