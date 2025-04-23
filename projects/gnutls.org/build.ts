import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, tag }: BuildOptions) {
  await unarchive(`https://www.gnupg.org/ftp/gcrypt/gnutls/v${version.marketing}/gnutls-${tag}.tar.xz`);
  run`./configure
        --prefix=${prefix}
        --disable-guile
        --disable-debug
        --disable-silent-rules
        --disable-dependency-tracking
        `;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
