import { BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://download.savannah.gnu.org/releases/freetype/freetype-${version}.tar.gz`);

  Path.cwd().join("build").mkdir().cd();

  run`cmake ..
    -GNinja
    -DBUILD_SHARED_LIBS=true
    -DCMAKE_INSTALL_PREFIX=${prefix}
    -DCMAKE_BUILD_TYPE=Release`;
  run`ninja install`;
}
