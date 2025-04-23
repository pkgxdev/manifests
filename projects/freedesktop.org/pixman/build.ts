import { BuildOptions, unarchive, run, env_include } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://cairographics.org/releases/pixman-${version}.tar.gz`);
  run`meson setup bld --prefix=${prefix}`;
  run`ninja -C bld install`;
}
