import { BuildOptions, unarchive, run, inreplace } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://dlcdn.apache.org/apr/apr-util-${version}.tar.bz2`);
  run`./configure
        --prefix=${prefix}
        --with-apr=${deps['apache.org/apr'].prefix}
        `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;

  inreplace(prefix.bin.join(`apu-${version.major}-config`),
    prefix.string,
    '"$(cd "$(dirname "$0")"/.. && pwd)"');
}