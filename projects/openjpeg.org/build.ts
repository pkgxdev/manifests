import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/uclouvain/openjpeg/archive/${tag}.tar.gz`);
  run`cmake -B bld -DCMAKE_INSTALL_PREFIX=${prefix} -DCMAKE_BUILD_TYPE=Release`;
  run`cmake --build bld --target install`;

// # fix unecessary prefixification of headers
//   cd {{prefix}}/include
//   mv openjpeg-{{version.marketing}}/* .
//   rmdir openjpeg-{{version.marketing}}
//   # keep unecessary prefixification for tools that expect it for some reason
//   ln -s . openjpeg-{{version.marketing}}
}