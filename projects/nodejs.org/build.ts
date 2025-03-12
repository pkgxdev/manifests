import { BuildOptions, ensure, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://nodejs.org/dist/${tag}/node-${tag}.tar.xz`);

  if (Deno.build.os != "windows") {
    ensure("python");

    run`./configure --prefix=${prefix} --shared-openssl --shared-zlib`;
    run`make --jobs ${navigator.hardwareConcurrency} install`;
  } else {
    run`.\\vcbuild`;
  }
}
