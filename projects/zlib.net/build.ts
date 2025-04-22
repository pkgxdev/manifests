import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://zlib.net/zlib-${tag.slice(1)}.tar.gz`);

  if (Deno.build.os == "windows") {
    run`cmake -B build -DCMAKE_INSTALL_PREFIX=${prefix}`;
    run`cmake --build build --target install`;
  } else {
    // https://github.com/madler/zlib/issues/960
    // notably this only started happening when we switched to our minimal
    // busybox container rather than debian:buster-slim
    if (Deno.build.os == "linux") {
      Deno.env.set("CFLAGS", "-Wl,--noinhibit-exec");
    }

    run`./configure --prefix=${prefix} --enable-shared`;
    run`make --jobs ${navigator.hardwareConcurrency} install`;
  }
}
