import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://github.com/lz4/lz4/archive/v${version}.tar.gz`);
  run`make --jobs ${navigator.hardwareConcurrency} install PREFIX=${prefix}`;
}
