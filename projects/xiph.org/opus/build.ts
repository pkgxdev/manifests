import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/xiph/opus/releases/download/${tag}/opus-${version}.tar.gz`);
  run`./configure
        --prefix=${prefix}
        --disable-dependency-tracking
        --disable-doc`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
