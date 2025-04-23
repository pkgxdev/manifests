import { BuildOptions, env_include, inreplace, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ftpmirror.gnu.org/gnu/libtool/libtool-${tag}.tar.gz`);

  if (Deno.build.os == "linux") {
    await env_include("m4");
  }

  run`./configure --prefix=${prefix} --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;

  inreplace(prefix.bin.join("libtoolize"), `prefix="${prefix}"`, 'prefix="$(cd "$(dirname "$0")/.." && pwd)"');
  inreplace(prefix.bin.join("libtoolize"), prefix.string, "$prefix");

  // commonly expected prefixes
  prefix.bin.join("glibtool").ln("s", { target: "libtool" });
  prefix.bin.join("glibtoolize").ln("s", { target: "libtoolize" });
}
