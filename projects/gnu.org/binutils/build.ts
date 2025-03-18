import { BuildOptions, env_include, run, SemVer, unarchive } from "brewkit";

export default async function ({ prefix, tag, version }: BuildOptions) {
  if (version.gte(new SemVer("2.44"))) {
    await unarchive(`https://ftp.gnu.org/gnu/binutils/binutils-with-gold-${tag}.tar.gz`);
  } else {
    await unarchive(`https://ftp.gnu.org/gnu/binutils/binutils-${tag}.tar.gz`);
  }

  if (Deno.build.os == "linux") {
    Deno.env.set("PKGX_DIST_URL", "https://dist.pkgx.dev");
    env_include("gnu.org/gcc");
    Deno.env.set("PKGX_DIST_URL", "https://dist.pkgx.dev/v2");
  }

  run`./configure
        --prefix=${prefix}
        --enable-ld=yes
        --enable-gold=yes
        `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`; // cannot install in parallel
}
