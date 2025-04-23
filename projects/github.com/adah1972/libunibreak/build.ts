import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/adah1972/libunibreak/releases/download/libunibreak_${version.major}_${version.minor}/libunibreak-${version.marketing}.tar.gz`);
  run`./configure
        --prefix=${prefix}
        --disable-silent-rules
        --disable-debug
        --disable-dependency-tracking
        `;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
