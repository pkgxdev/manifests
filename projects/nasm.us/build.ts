import { BuildOptions, env_include, Path, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://www.nasm.us/pub/nasm/releasebuilds/${tag}/nasm-${tag}.tar.xz`);

  if (Deno.build.os != "windows") {
    run`./configure --prefix=${prefix}`;
    run`make --jobs ${navigator.hardwareConcurrency}`;
    run`make install`;
  } else {
    run`nmake /f Mkfiles/msvc.mak`;

    Path.cwd().join("nasm.exe").cp({ into: prefix.bin.mkdir('p') });
    Path.cwd().join("ndisasm.exe").cp({ into: prefix.bin });
    Path.cwd().join("include").cp({ into: prefix });
    Path.cwd().join("libnasm.lib").cp({ into: prefix.join('lib').mkdir() });
  }
}
