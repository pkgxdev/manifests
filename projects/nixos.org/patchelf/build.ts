import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://github.com/NixOS/patchelf/releases/download/${version}/patchelf-${version}.tar.bz2`);

  run`./configure --prefix=${prefix}`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
