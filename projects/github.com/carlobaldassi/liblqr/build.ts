import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/carlobaldassi/liblqr/archive/refs/tags/v${version}.tar.gz`);
  run`./configure --prefix=${prefix} --enable-install-man`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
