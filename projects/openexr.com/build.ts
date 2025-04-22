import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/AcademySoftwareFoundation/openexr/archive/refs/tags/v${version}.tar.gz`);
  run`cmake -B bld -DCMAKE_INSTALL_PREFIX=${prefix}`;
  run`cmake --build bld --target install`;
//   linux:
//     ARGS:
//       - '-DCMAKE_EXE_LINKER_FLAGS="-Wl,-lstdc++fs"'
}
