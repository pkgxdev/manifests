import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://ijg.org/files/jpegsrc.${tag}.tar.gz`);
  run`./configure
        --disable-dependency-tracking
        --disable-silent-rules
        --prefix=${prefix}`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
