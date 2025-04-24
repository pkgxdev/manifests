import { BuildOptions, unarchive, run, inreplace } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://dlcdn.apache.org/apr/apr-${version}.tar.gz`);
  run`./configure --prefix=${prefix} --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;

  inreplace(prefix.bin.join(`apr-${version.major}-config`),
    prefix.string,
    '"$(cd "$(dirname "$0")"/.. && pwd)"');

  inreplace(
    prefix.join(`build-1/apr_rules.mk`),
    prefix.string,
    `$(shell apr-${version.major}-config --prefix)`);
}
