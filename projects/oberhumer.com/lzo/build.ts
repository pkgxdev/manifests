import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://www.oberhumer.com/opensource/lzo/download/lzo-${version.marketing}.tar.gz`);
  run`./configure --disable-dependency-tracking --enable-shared --prefix=${prefix}`;
  run`make`;
  run`make check`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}