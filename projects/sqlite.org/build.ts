import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag, year, deps }: BuildOptions & { year: string }) {
  await unarchive(`https://sqlite.org/${year}/sqlite-autoconf-${tag}.tar.gz`);

  if (Deno.build.os != "windows") {
    //copied from brew (without understanding why)
    let cppflags = `
        -DSQLITE_ENABLE_API_ARMOR=1
        -DSQLITE_ENABLE_COLUMN_METADATA=1
        -DSQLITE_ENABLE_DBSTAT_VTAB=1
        -DSQLITE_ENABLE_FTS3=1
        -DSQLITE_ENABLE_FTS3_PARENTHESIS=1
        -DSQLITE_ENABLE_FTS5=1
        -DSQLITE_ENABLE_JSON1=1
        -DSQLITE_ENABLE_MEMORY_MANAGEMENT=1
        -DSQLITE_ENABLE_RTREE=1
        -DSQLITE_ENABLE_STAT4=1
        -DSQLITE_ENABLE_UNLOCK_NOTIFY=1
        -DSQLITE_USE_URI=1
      `;
    // default value of MAX_VARIABLE_NUMBER is 999 which is too low for many
    // applications. Set to 250000 (Same value used in Debian and Ubuntu).
    cppflags += `-DSQLITE_MAX_VARIABLE_NUMBER=250000`;
    Deno.env.set("CPPFLAGS", cppflags);

    let extra = "";
    if (Deno.build.os == "linux") {
      extra = `
        --enable-readline
        --disable-editline
        "--with-readline-ldflags=-L${deps["gnu.org/readline"].prefix}/lib -L${
        deps["invisible-island.net/ncurses"].prefix
      }/lib -lncursesw -lreadline -ltinfow"
        `;
      extra += ` --with-readline-cflags=-I${deps["gnu.org/readline"].prefix}/include`;
    }

    run`./configure
        --prefix=${prefix}
        --enable-session
        ${extra}
        `;
    run`make --jobs ${navigator.hardwareConcurrency} install`;
  } else {
    run`nmake /f Makefile.msc`;
    prefix.bin.install("sqlite3.exe");
    prefix.include.install("sqlite3.h");
    prefix.include.install("sqlite3ext.h");
    prefix.lib.install("sqlite3.dll");
    prefix.lib.install("sqlite3.lib");
  }
}
