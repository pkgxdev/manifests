import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.alsa-project.org/files/pub/lib/alsa-lib-${version}.tar.bz2`);
  run`./configure
        --prefix=${prefix}
        --disable-debug
        --disable-dependency-tracking
        --disable-silent-rules`;
  run`make --jobs ${navigator.hardwareConcurrency} install`
}
