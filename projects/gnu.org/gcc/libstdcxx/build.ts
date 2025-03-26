import { env_include, BuildOptions, Path, run, unarchive } from "brewkit";

export default async function build({ prefix, version }: BuildOptions) {
  await unarchive(`https://ftp.gnu.org/gnu/gcc/gcc-${version}/gcc-${version}.tar.gz`);

  env_include("gnu.org/gcc");

  Path.cwd().join("build").mkdir().cd();

  run`../configure
        --prefix=${prefix}
        --enable-languages=c,c++
        --disable-multilib
        --disable-bootstrap
        --disable-nls
        --enable-default-pie
        --enable-pie-tools
        --enable-host-pie
        `;
  run`make V=1
    # --jobs ${navigator.hardwareConcurrency}
      all-target-libstdc++-v3
    # all-target-libgcc`;
  run`make install-strip-target-libstdc++-v3`;// install-strip-target-libgcc`;

  prefix.join("lib64").mv({ to: prefix.lib });
}
