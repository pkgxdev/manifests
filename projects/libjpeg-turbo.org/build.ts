import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/libjpeg-turbo/libjpeg-turbo/releases/download/${tag}/libjpeg-turbo-${tag}.tar.gz`);

  run`cmake
        -B scaffold
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DCMAKE_BUILD_TYPE=Release
        -DWITH_JPEG8=1`;
  run`cmake --build scaffold --config Release --target install`;
}
