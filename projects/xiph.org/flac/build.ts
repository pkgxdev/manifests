import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://downloads.xiph.org/releases/flac/flac-${version}.tar.xz`);
  run`./configure
        --disable-debug
        --disable-dependency-tracking
        --prefix=${prefix}`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
