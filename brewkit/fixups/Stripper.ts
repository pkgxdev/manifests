import Path from "../path.ts";
import run from "../run.ts";

export default class Stripper {
  paths: Path[] = [];

  push(path: Path) {
    switch (path.extname()) {
      case ".bundle":
      case ".o":
        // cannot strip these, you always lose needed symbols AFICT
        return;
    }
    this.paths.push(path);
  }

  execute() {
    // on linux we don’t want to accidentally use eg. the just built llvm’s strip
    const strip = Deno.build.os == "linux" ? `${Deno.env.get("PKGX_BIN")}/strip` : "strip";
    for (const path of this.paths) {
      if (path.string.endsWith(".dylib") || /\.so(\.\d)*$/.test(path.string)) {
        run`strip -x ${path}`;
      } else if (path.basename().startsWith("perl")) {
        // perl uses symbols in itself for its modules
        //FIXME should be easy to override default fixups and exclude this
        run`strip -x ${path}`;
      } else if (Deno.build.os == "darwin") {
        run`strip -u -r ${path}`;
      } else {
        run`strip -Ss ${path}`;
      }
    }
  }
}
