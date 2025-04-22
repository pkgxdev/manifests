import { BuildOptions, unarchive, run, inreplace } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://prdownloads.sourceforge.net/project/lame/lame/${tag}/lame-${tag}.tar.gz`);

  // https://sourceforge.net/p/lame/mailman/message/36081038/
  const lines = Deno.readTextFileSync("./include/libmp3lame.sym").split("\n");
  const newLines = lines.filter(line => line.trim() != "lame_init_old");
  Deno.writeTextFileSync("./include/libmp3lame.sym", newLines.join("\n"));

  run`./configure --prefix=${prefix}
        --disable-debug
        --disable-dependency-tracking
        --enable-nasm`;
  run`make install`;
// env:
//   linux/x86-64:
//     CFLAGS: '-fPIC'
//     CXXFLAGS: '-fPIC'
//     LDFLAGS: '-pie'
}