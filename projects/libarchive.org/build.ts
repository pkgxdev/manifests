import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(
    `https://github.com/libarchive/libarchive/releases/download/${tag}/libarchive-${tag.slice(1)}.tar.gz`,
  );

  run`cmake . -B build -DCMAKE_INSTALL_PREFIX=${prefix} -DCMAKE_BUILD_TYPE=Release`;
  run`cmake --build build`;
  run`cmake --build build --target install`;
}
