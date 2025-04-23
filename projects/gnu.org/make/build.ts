import { BuildOptions, Path, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ftpmirror.gnu.org/gnu/make/make-${tag}.tar.gz`);

  if (Deno.build.os != "windows") {
    run`./configure --prefix=${prefix}`;
    run`make --jobs ${navigator.hardwareConcurrency} install`;
  } else {
    run`.\build_w32.bat`;
    Path.cwd().join("WinRel/gnumake.exe").mv({ to: prefix.bin.mkdir("p").join("make.exe") });
  }
}
