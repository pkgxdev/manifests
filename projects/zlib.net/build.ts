import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag, raw }: any) {
  await unarchive(`https://zlib.net/zlib-${raw}.tar.gz`);

  run`./configure --prefix=${prefix}`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
