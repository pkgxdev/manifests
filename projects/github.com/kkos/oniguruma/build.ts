import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://github.com/kkos/oniguruma/releases/download/v${version}/onig-${version}.tar.gz`);
  run`./configure --disable-dependency-tracking --prefix=${prefix} --disable-debug`
  run`make install`;
}
