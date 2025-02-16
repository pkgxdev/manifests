import { env_include, BuildOptions, inreplace, run, unarchive } from "brewkit";
import { expandGlob } from "jsr:@std/fs@1/expand-glob";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(
    `https://ftp.gnu.org/gnu/ncurses/ncurses-${tag.replace(/^v/, "")}.tar.gz`,
  );


  let extra = "--with-cxx-shared";

  if (Deno.build.os == "linux") {
    env_include("gnu.org/gcc"); // for libstdc++
    // cannot build shared c++ libraries against static libstdc++
    // without this ldd fails and we thus expect other things will too
    extra = "--with-versioned-syms";
  }

  run`./configure
        --prefix=${prefix}
        --disable-debug
        --enable-pc-files
        --enable-sigwinch
        --enable-widec
        --with-shared
        ${extra}
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

  // the wide variants are the right modern choice
  // much stuff however still expects to link to the non-wide variants
  // symlinking like this is a safe and common practice
  for await (const {name} of expandGlob(prefix.lib.join("lib*w*").string)) {
    prefix.lib.join(name.replace("w", "")).ln('s', { target: name });
  }
}
