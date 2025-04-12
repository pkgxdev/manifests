import { BuildOptions, unarchive, run, SemVer } from "brewkit";

export default async function ({ prefix, version, props }: BuildOptions) {
  await unarchive(`https://downloads.sourceforge.net/project/giflib/giflib-${version}.tar.gz`);
  if (Deno.build.os == 'darwin' && version.lt(new SemVer("5.2.2"))) {
    run`patch -p1 --input ${props}/Makefile.patch`;
  }
  run`make --jobs ${navigator.hardwareConcurrency} all`;
  run`make install PREFIX=${prefix}`
}
