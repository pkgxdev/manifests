import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag, deps }: BuildOptions) {
  await unarchive(`https://zlib.net/zlib-${tag.slice(1)}.tar.gz`);

  if (Deno.build.os == "windows") {
    run`cmake -B build -DCMAKE_INSTALL_PREFIX=${prefix}`;
    run`cmake --build build --config Release`;
    run`cmake --install build`;
  } else {
    run`./configure --prefix=${prefix} --enable-shared`;
    run`make --jobs ${navigator.hardwareConcurrency} install`;
  }
}
