import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/OpenPrinting/cups/releases/download/${tag}/cups-${version}-source.tar.gz`);
  run`./configure
        --prefix=${prefix}
        --with-components=core
        --without-bundledir
        --disable-debug
        --disable-dependency-tracking`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
