import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/libjpeg-turbo/libjpeg-turbo/releases/download/${tag}/libjpeg-turbo-${tag}.tar.gz`);

  run`cmake
        -B bld
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DWITH_JPEG8=1`;
  run`cmake --build bld --target install`;
}
