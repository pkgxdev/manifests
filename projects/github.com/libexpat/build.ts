import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag, version }: BuildOptions) {
  const url = `https://github.com/libexpat/libexpat/releases/download/${tag}/expat-${version}.tar`;
  if (Deno.build.os != "windows") {
    await unarchive(`${url}.xz`);
    run`./configure --prefix=${prefix} --disable-debug`;
    run`make --jobs ${navigator.hardwareConcurrency} install`;
  } else {
    // per usual, cmake support is still experimental, but recommended for Windows
    await unarchive(`${url}.gz`); // windows blocks trying to untar `.xz`s
    run`cmake -B build -S . -DCMAKE_INSTALL_PREFIX=${prefix} -DCMAKE_BUILD_TYPE=Release`;
    run`cmake --build build --config Release --parallel --target install`;
  }
}
