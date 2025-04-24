import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/skvadrik/re2c/releases/download/${tag}/re2c-${tag}.tar.xz`);
  run`./configure --prefix=${prefix}`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
