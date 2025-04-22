import { BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ prefix, version, tag }: BuildOptions) {
  const url = `https://github.com/libevent/libevent/releases/download/${tag}/libevent-${version}-stable.tar.gz`;
  await unarchive(url);
  run`cmake
      -B bld
      -DCMAKE_INSTALL_PREFIX=${prefix}
      `;
  run`cmake --build bld --target install`;
}
