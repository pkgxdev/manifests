import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/libass/libass/releases/download/${version}/libass-${version}.tar.gz`);
  let extra = '';
  if (Deno.build.os === 'darwin') {
    extra = '--disable-fontconfig';
  }
  run`./configure
        --prefix=${prefix}
        --disable-dependency-tracking
        ${extra}`;
  run`make install`;
}
