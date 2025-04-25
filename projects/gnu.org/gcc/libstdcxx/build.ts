import { env_include, BuildOptions, Path, run, unarchive } from "brewkit";

export default async function build({ prefix, version }: BuildOptions) {
  await unarchive(`https://ftpmirror.gnu.org/gnu/gcc/gcc-${version}/gcc-${version}.tar.gz`);

  const old = Deno.env.get("PKGX_DIST_URL");
  Deno.env.delete("PKGX_DIST_URL");
  Deno.env.delete("PKGX_PANTRY_DIR");
  env_include("gnu.org/gcc^14");
  Deno.env.set("PKGX_DIST_URL", "https://dist.pkgx.dev/v2");
  Deno.env.set("PKGX_PANTRY_DIR", old!);

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
        --jobs ${navigator.hardwareConcurrency}
        all-target-libstdc++-v3
        all-target-libgcc`;
  run`make
        install-strip-target-libstdc++-v3
        install-strip-target-libgcc`;

  prefix.join("lib64").isDirectory()?.mv({ to: prefix.lib.rm() });
}
