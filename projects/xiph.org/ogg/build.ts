import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://downloads.xiph.org/releases/ogg/libogg-${version}.tar.gz`);
  run`./configure --prefix=${prefix} --disable-dependency-tracking`;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;
}
