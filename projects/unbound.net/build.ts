import { ensure, BuildOptions, unarchive, run, env_include, inreplace } from "brewkit";

export default async function ({ prefix, version, deps }: BuildOptions) {
  await unarchive(`https://github.com/NLnetLabs/unbound/archive/refs/tags/release-${version}.tar.gz`);

  env_include("github.com/westes/flex");

  run`./configure
    --prefix=${prefix}
    --sbindir=${prefix}/bin
    --with-ssl=${deps['openssl.org'].prefix}
    --with-libexpat=${deps['github.com/libexpat'].prefix}
    `;
  run`make --jobs ${navigator.hardwareConcurrency} install`;

  inreplace(
    prefix.bin.join("unbound-control-setup"),
    /DESTDIR=.*/,
    'DESTDIR="$(cd "$(dirname "$0")/.." && pwd)"');
}
