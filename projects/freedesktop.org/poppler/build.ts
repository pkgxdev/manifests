import { env_include, BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://poppler.freedesktop.org/poppler-${tag}.tar.xz`);

  env_include("gnome.org/gobject-introspection^1.64");

  run`cmake
        -B bld
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DENABLE_QT5=OFF
        -DENABLE_QT6=OFF
        `;
  run`cmake --build bld --target install`;
}