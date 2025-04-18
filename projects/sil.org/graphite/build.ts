import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/silnrsi/graphite/releases/download/${version}/graphite2-${version}.tgz`);
  run`cmake -B bld -DCMAKE_INSTALL_PREFIX=${prefix} -DCMAKE_BUILD_TYPE=Release`
  run`cmake --build bld --target install`
}
