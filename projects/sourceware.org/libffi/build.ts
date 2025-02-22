import { BuildOptions, run, unarchive } from "brewkit";

export default async function build({ prefix, version, tag }: BuildOptions) {
  await unarchive(`https://github.com/libffi/libffi/releases/download/${tag}/libffi-${version}.tar.gz`);

  run`./configure --prefix=${prefix} --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
