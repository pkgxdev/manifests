import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://ftpmirror.gnu.org/gnu/libtasn1/libtasn1-${version}.tar.gz`);
  run`./configure
        --prefix=${prefix}
        --disable-dependency-tracking
        --disable-silent-rules
        --disable-debug
        `;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
