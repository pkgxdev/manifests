import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(
    `https://github.com/libarchive/libarchive/releases/download/${tag}/libarchive-${tag.slice(1)}.tar.gz`,
  );

  run`cmake . -B bld -DCMAKE_INSTALL_PREFIX=${prefix}`;
  run`cmake --build bld --target install`;
}
