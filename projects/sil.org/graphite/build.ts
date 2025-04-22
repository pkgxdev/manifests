import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/silnrsi/graphite/releases/download/${version}/graphite2-${version}.tgz`);
  run`cmake -B bld -DCMAKE_INSTALL_PREFIX=${prefix}`
  run`cmake --build bld --target install`
}
