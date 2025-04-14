import { BuildOptions, unarchive, venvify } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://github.com/mesonbuild/meson/releases/download/${version}/meson-${version}.tar.gz`);
  await venvify(prefix, "meson");
}
