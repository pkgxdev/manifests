import { env_include, BuildOptions, Path, run, unarchive } from "brewkit";
import { expandGlob } from "jsr:@std/fs@1/expand-glob";

export default async function build({ prefix, version }: BuildOptions) {
  await unarchive(`https://ftpmirror.gnu.org/gnu/gcc/gcc-${version}/gcc-${version}.tar.gz`);

  env_include("gnu.org/gcc^14");

  Path.cwd().join("build").mkdir().cd();

  run`../configure
        --prefix=${prefix}
        --enable-languages=c,c++
        --disable-multilib
        --enable-bootstrap  # or it fails
        --disable-nls
        --enable-default-pie
        --enable-pie-tools
        --enable-host-pie
        `;
  run`make
        --jobs ${navigator.hardwareConcurrency}
        # all-target-libstdc++-v3
        # all-target-libgcc`;
  run`make
        install-strip-target-libstdc++-v3
        install-strip-target-libgcc`;

  const lib64 = prefix.join("lib64");
  for await (const { path } of expandGlob(`${lib64}/*`)) {
    new Path(path).mv({ into: prefix.lib.mkdir() });
  }
  lib64.rm();
}
