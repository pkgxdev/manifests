import { BuildOptions, inreplace, Path, unarchive } from "brewkit";

export default async function ({ prefix, tag, version }: BuildOptions) {
  await unarchive(`https://github.com/pkgxdev/pkgo/archive/refs/tags/${tag}.tar.gz`)

  inreplace('./entrypoint.ts', '0.0.0-dev', version.toString());

  if (Deno.build.os == 'windows') {
    Path.cwd().join('entrypoint.ts').mv({ into: prefix.bin.mkdir('p') });
    Path.cwd().join('entrypoint.cmd').mv({ to: prefix.bin.join('pkgo.cmd') });
  } else {
    Path.cwd().join('entrypoint.ts').mv({ to: prefix.bin.mkdir('p').join('pkgo') });
  }
}
