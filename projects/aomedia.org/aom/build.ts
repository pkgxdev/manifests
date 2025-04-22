import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://aomedia.googlesource.com/aom/+archive/${tag}.tar.gz`, {stripComponents: 0});
  run`cmake
        -B bld
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DBUILD_SHARED_LIBS=1
        `;
  run`cmake --build bld --target install`;
}
