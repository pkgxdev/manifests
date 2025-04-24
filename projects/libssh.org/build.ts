import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.libssh.org/files/${version.major}.${version.minor}/libssh-${version}.tar.xz`);
  run`cmake
        -B bld
        -DWITH_SYMBOL_VERSIONING=OFF
        -DCMAKE_INSTALL_PREFIX=${prefix}`;
  run`cmake --build bld --target install`;
}