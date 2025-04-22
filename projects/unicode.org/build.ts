import { BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://github.com/unicode-org/icu/releases/download/release-${version.major}-${version.minor}/icu4c-${version.major}_${version.minor}-src.tgz`);

  if (Deno.build.os == 'darwin') {
    Deno.env.set("LDFLAGS", "-headerpad_max_install_names");
  }

  Deno.chdir("source");

  run`./configure
        --prefix=${prefix}
        --disable-samples
        --disable-tests
        --enable-static
        --with-library-bits=64`;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;
}
