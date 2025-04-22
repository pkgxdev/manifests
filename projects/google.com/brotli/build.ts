import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/google/brotli/archive/${tag}.tar.gz`);
  run`cmake -B bld -DCMAKE_INSTALL_PREFIX=${prefix}`;
  run`cmake --build bld --target install`;
}
