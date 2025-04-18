import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://ftp.gnu.org/gnu/gperf/gperf-${tag}.tar.gz`);
  // script:
//   - run: sed -i 's/register //g' src/output.cc lib/getline.cc
//     if: linux
  run`./configure --prefix=${prefix}`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}