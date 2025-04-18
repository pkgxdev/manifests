import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/nih-at/libzip/archive/refs/tags/${tag}.tar.gz`);
  run`cmake
        -B bld
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DBUILD_REGRESS=OFF
        -DBUILD_EXAMPLES=OFF
        -DENABLE_GNUTLS=OFF
        -DENABLE_MBEDTLS=OFF
        `;
  run`cmake --build bld --target install`;
}
