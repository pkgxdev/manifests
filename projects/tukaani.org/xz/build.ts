import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag, version }: BuildOptions) {
  await unarchive(
    `https://github.com/tukaani-project/xz/releases/download/${tag}/xz-${version}.tar.gz`,
  );

  if (Deno.build.os !== "windows") {
    run`./configure --prefix=${prefix} --disable-debug --disable-doc`;
    run`make --jobs ${navigator.hardwareConcurrency} install`;
  } else {
    run`cmake -S . -B build -DCMAKE_INSTALL_PREFIX=${prefix} -DCMAKE_BUILD_TYPE=Release`;
    run`cmake --build build --config Release --parallel ${navigator.hardwareConcurrency}`;
    run`cmake --install build --config Release`;
  }
}
