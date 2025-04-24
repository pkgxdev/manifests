import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://downloads.xiph.org/releases/vorbis/libvorbis-${version}.tar.xz`);
  run`./configure --prefix=${prefix} CC=clang`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
