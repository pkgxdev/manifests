import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: any) {
  await unarchive(`https://zlib.net/zlib-${tag.slice(1)}.tar.gz`);

  run`./configure --prefix=${prefix}`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
