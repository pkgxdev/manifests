import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, deps, tag }: BuildOptions) {
  await unarchive(`https://gnupg.org/ftp/gcrypt/gpgme/gpgme-${tag}.tar.bz2`);
  run`./configure
        --prefix=${prefix}
        --with-libassuan-prefix=${deps['gnupg.org/libassuan'].prefix}
        --with-libgpg-error-prefix=${deps['gnupg.org/libgpg-error'].prefix}
        --disable-gpg-test
        --disable-glibtest
        --disable-gpgconf-test
        --disable-gpg-test
        --disable-gpgsm-test
        --disable-g13-test
  `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;
//   CFLAGS: $CFLAGS -Wno-implicit-function-declaration
//   CXXFLAGS: $CXXFLAGS -std=c++14
//   linux:
//     LDFLAGS: '$LDFLAGS -Wl,--allow-shlib-undefined'
// dependencies:
//   gnupg.org: '*'
//   gnupg.org/libassuan: ^2.0.2
//   gnupg.org/libgpg-error: ^1.11
}