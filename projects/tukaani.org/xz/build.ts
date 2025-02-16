import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag, version }: BuildOptions) {
  await unarchive(
    `https://github.com/tukaani-project/xz/releases/download/${tag}/xz-${version}.tar.gz`,
  );

  run`./configure --prefix=${prefix} --disable-debug --disable-doc`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
