import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://pyyaml.org/download/libyaml/yaml-${version}.tar.gz`);

  run`./configure --prefix=${prefix} --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
