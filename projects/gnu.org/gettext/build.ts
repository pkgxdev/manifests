import { BuildOptions, inreplace, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ftp.gnu.org/gnu/gettext/gettext-${tag.slice(1)}.tar.gz`);
  run`./configure
        --prefix=${prefix}
        --disable-debug
        --with-included-debug
        --with-included-libcroco
        --with-included-libunistring
        --without-included-libxml
        --disable-java
        --disable-csharp`;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;

  inreplace(prefix.bin.join("gettextize"), prefix.string, '"$(cd "$(dirname "$0")/.." && pwd)"');
  inreplace(prefix.bin.join("autopoint"), prefix.string, '"$(cd "$(dirname "$0")/.." && pwd)"');
}
