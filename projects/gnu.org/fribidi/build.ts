import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/fribidi/fribidi/releases/download/v${version}/fribidi-${version}.tar.xz`);
  run`./configure --prefix=${prefix} --disable-debug`
  run`make --jobs=${navigator.hardwareConcurrency} install`;
}
