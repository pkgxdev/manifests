import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/AcademySoftwareFoundation/Imath/archive/refs/tags/v${version}.tar.gz`);
  run`cmake -B bld -DCMAKE_INSTALL_PREFIX=${prefix}`;
  run`cmake --build bld --target install`;
}
