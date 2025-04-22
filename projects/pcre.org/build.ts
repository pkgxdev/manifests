import { BuildOptions, unarchive, run, inreplace } from "brewkit";

export default async function ({ prefix, version, tag }: BuildOptions) {
  if (version.major >= 10) {
    await unarchive(`https://github.com/PCRE2Project/pcre2/releases/download/pcre2-${version.major}.${version.minor}/pcre2-${version.major}.${version.minor}.tar.gz`);
  } else {
    await unarchive(`https://downloads.sourceforge.net/project/pcre/pcre/${tag}/pcre-${tag}.tar.bz2`);
  }

  run`./configure
        --prefix=${prefix}
        --enable-pcre2-16
        --enable-pcre2-32
        --enable-pcre2grep-libz
        --enable-pcre2grep-libbz2
        --enable-jit
        `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;

  const v = version.major >= 10 ? '2' : '';
  inreplace(prefix.bin.join(`pcre${v}-config`), /prefix=.*/g, 'prefix=$(dirname $(dirname $0))');
}
