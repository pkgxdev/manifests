import { BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://download.savannah.gnu.org/releases/freetype/freetype-${version}.tar.gz`);
  run`cmake
    -B bld
    -DBUILD_SHARED_LIBS=true
    -DCMAKE_INSTALL_PREFIX=${prefix}
    `;
  run`cmake --build bld --target install`;
}
