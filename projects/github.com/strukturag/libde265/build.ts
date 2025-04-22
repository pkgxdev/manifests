import { BuildOptions, unarchive, run, backticks } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/strukturag/libde265/releases/download/v${version}/libde265-${version}.tar.gz`);
  let extra = '';
  if (Deno.build.os === 'darwin' && Deno.build.arch === 'aarch64') {
    const uname_r = await backticks`uname -r`;
    extra =  `--build=aarch64-apple-darwin${uname_r}`;
  }
  run`./configure
        --prefix=${prefix}
        --disable-dependency-tracking
        --disable-silent-rules
        --disable-sherlock265
        --disable-dec265
        ${extra}
        `;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}