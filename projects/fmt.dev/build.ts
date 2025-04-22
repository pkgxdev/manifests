import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/fmtlib/fmt/archive/${version}.tar.gz`);
  run`cmake
        -B bld
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DBUILD_SHARED_LIBS=ON`;
  run`cmake --build bld --target install`;
}
