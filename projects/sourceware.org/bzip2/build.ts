import { BuildOptions, flatmap, Path, run, unarchive } from "brewkit";
import { expandGlob } from "jsr:@std/fs@1/expand-glob";

export default async function build({ prefix, version, props }: BuildOptions) {
  await unarchive(`https://sourceware.org/pub/bzip2/bzip2-${version}.tar.gz`);

  run`make PREFIX=${prefix}`;
  run`make PREFIX=${prefix} install`;
  flatmap(lib(), (lib) => run`make PREFIX=${prefix} --file ${lib}`);

  for await (const { path } of expandGlob("*.so.*")) {
    Path.cwd().join(path).mv({ into: prefix.join("lib") });
  }

  function lib() {
    switch (Deno.build.os) {
      case "linux":
        return "Makefile-libbz2_so";
      case "darwin":
        return props.join("Makefile-libbz2_dylib").string;
    }
  }
}
