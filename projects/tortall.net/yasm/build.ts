import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.tortall.net/projects/yasm/releases/yasm-${version}.tar.gz`);
  run`./configure --prefix=${prefix} --disable-python --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
