import { BuildOptions, unarchive, run, SemVer, inreplace } from "brewkit";

export default async function ({ prefix, version, props }: BuildOptions) {
  await unarchive(`https://downloads.sourceforge.net/project/giflib/giflib-${version}.tar.gz`);
  if (Deno.build.os == 'darwin' && version.lt(new SemVer("5.2.2"))) {
    run`patch -p1 --input ${props}/Makefile.patch`;
  } else {
    // building the docs requires image magick and well… we don’t want docs
    inreplace("Makefile", "$(MAKE) -C doc", "");
  }
  run`make --jobs ${navigator.hardwareConcurrency} all`;
  run`make install-bin install-lib install-man install-include PREFIX=${prefix}`
}
