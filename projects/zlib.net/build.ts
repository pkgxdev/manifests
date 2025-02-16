import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://zlib.net/zlib-${tag.slice(1)}.tar.gz`);

  if (Deno.build.os == "linux") {
    // undefined symbol errors in newer llvms prevent building shared libs
    Deno.env.set("CFLAGS", "-Wl,--undefined-version");
  }

  run`./configure --prefix=${prefix} --enable-shared`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
