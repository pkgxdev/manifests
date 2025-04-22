import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://gnupg.org/ftp/gcrypt/libgpg-error/libgpg-error-${tag}.tar.gz`);
  // script:
//   - run: |
//       sed -i -e '/#include "gpgrt-int.h"/a\
//       \
//       #if defined (__APPLE__)\
//       extern char** environ;\
//       #endif' \
//       spawn-posix.c
//     if: '>=1.50'
//     working-directory: src
  run`./configure --prefix=${prefix} --enable-install-gpg-error-config`;
  run`make`;
  run`make check`;
  run`make install`;
}
