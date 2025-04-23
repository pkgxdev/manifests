import { env_include, BuildOptions, inreplace, run, unarchive } from "brewkit";

export default async function({ prefix, version}: BuildOptions) {
  await unarchive(`https://download.gnome.org/sources/libxml2/${version.marketing}/libxml2-${version}.tar.xz`);

  if (Deno.build.os === "linux") {
    Deno.env.set("CFLAGS", "-Wl,--undefined-version");
  }

  env_include("python~3.9");

  run`./configure --prefix=${prefix} --without-lzma`;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;

  inreplace(prefix.bin.join("xml2-config"), prefix.string, '$(cd "$(dirname "$0")/.." && pwd)');
}
