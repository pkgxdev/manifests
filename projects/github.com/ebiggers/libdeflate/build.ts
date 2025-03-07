import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/ebiggers/libdeflate/archive/refs/tags/${tag}.tar.gz`);

  run`cmake -S . -B build -DCMAKE_INSTALL_PREFIX=${prefix} -DCMAKE_BUILD_TYPE=Release`;
  run`cmake --build build --config Release --target install`;
}
