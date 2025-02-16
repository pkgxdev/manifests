import { BuildOptions, inreplace, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(
    `https://ftp.gnu.org/gnu/ncurses/ncurses-${tag.replace(/^v/, "")}.tar.gz`,
  );

  run`./configure
        --prefix=${prefix}
        --disable-debug
        --enable-pc-files
        --enable-sigwinch
        --enable-widec
        --with-shared
        --with-cxx-shared
        --with-gpm=no
        --without-ada
        --with-pkg-config-libdir=${prefix}/lib/pkgconfig
        --with-termlib
        --with-terminfo-dirs=/usr/share/terminfo:/usr/local/share/terminfo
        --without-tests
        `;

  run`make --jobs ${navigator.hardwareConcurrency} install`;

  inreplace(
    prefix.join("bin/ncursesw6-config"),
    `prefix="${prefix}"`,
    `prefix="$(cd "$(dirname "$0")/.." && pwd)"`,
  );

  inreplace(
    prefix.join("bin/ncursesw6-config"),
    prefix.string,
    "$prefix",
  );
}
