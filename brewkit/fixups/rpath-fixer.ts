import { backticks, backticks_quiet, Path, run } from "brewkit";
import { fromFileUrl } from "jsr:@std/path@^1.0.8";

export default class RpathFixer {
  files: Path[] = [];
  install_prefix: Path;
  final_prefix: Path;
  PKGX_DIR: Path;
  deps_prefixes: Path[];

  constructor(install_prefix: Path, final_prefix: Path, deps: Path[], PKGX_DIR: Path) {
    this.deps_prefixes = deps;
    this.install_prefix = install_prefix;
    this.final_prefix = final_prefix;
    this.PKGX_DIR = PKGX_DIR;
  }

  push(path: Path) {
    const { mode } = Deno.statSync(path.string);
    if (!mode || !(mode & 0o200)) {
      const newMode = (mode || 0) | 0o200; // chmod u+x
      path.chmod(newMode);
    }
    if (Deno.build.os == "linux" && path.extname() == ".o") return;
    this.files.push(path);
  }

  async execute() {
    switch (Deno.build.os) {
      case "linux":
        for (const file of this.files) {
          await this.execute_linux(file);
        }
        break;

      case "darwin": {
        const script = new Path(fromFileUrl(import.meta.url)).join(
          "../../scripts/fix-macho.rb",
        );

        Deno.env.set("GEM_HOME", "/tmp/gem");

        for (const file of this.files) {
          Deno.env.set("LIBS", JSON.stringify(this.files));
          run`${script} ${file} ${this.install_prefix} ${this.final_prefix} ${this.PKGX_DIR}`;
        }
      }
    }
  }

  async execute_linux(file: Path) {
    let rpaths: string[] = [];

    const LDLPATH = [
      this.final_prefix.join("lib"),
      ...this.deps_prefixes.map((prefix) => prefix.join("lib")),
    ].join(":");
    const old_LDLPATH = Deno.env.get("LD_LIBRARY_PATH");
    Deno.env.set("LD_LIBRARY_PATH", LDLPATH);

    for (const linked_lib of ldd(file)) {
      console.error(file, linked_lib);

      let rpath = "";
      if (linked_lib.startsWith(this.final_prefix.string)) {
        rpath = new Path(linked_lib).parent().relative({
          to: file.parent(),
        });
      } else if (linked_lib.startsWith(this.install_prefix.string)) {
        rpath = new Path(linked_lib).relative({
          to: this.install_prefix
        });
        const foo = this.final_prefix.join(rpath);
        rpath = new Path(foo).parent().relative({
          to: file.parent(),
        });
      } else if (linked_lib.startsWith(this.PKGX_DIR.string)) {
        let mangled_path = linked_lib.replace(
          new RegExp("/v(\\d+)\\.(\\d+\\.)+\\d+[a-z]?/"),
          (_, capture) => `/v${capture}/`,
        );
        rpath = new Path(mangled_path).parent().relative({
          to: file.parent(),
        });
      } else {
        console.error(`::error::could not fix: ${linked_lib}`);
        continue;
      }
      rpaths.push(rpath);

      if (/.so\d+(\.\d)+/.test(linked_lib)) {
        // has linked to a version that is too strict
        const basename = new Path(linked_lib).basename();
        const libname = basename.replace(/\.so.(\d+)(\.\d)+/, (_, capture) => `.so.${capture}`);
        run`patchelf --replace-needed ${basename} ${libname} ${file}`;
      }
    }

    if (old_LDLPATH) {
      Deno.env.set("LD_LIBRARY_PATH", old_LDLPATH);
    } else {
      Deno.env.delete("LD_LIBRARY_PATH");
    }

    rpaths = rpaths.uniq().map((rpath) => `$ORIGIN/${rpath || "."}`);

    if (rpaths.length) {
      run`patchelf --set-rpath ${rpaths.join(":")} ${file}`;
    } else {
      run`patchelf --remove-rpath ${file}`;
    }
  }
}

function ldd(file: Path): string[] {
  const libs: string[] = [];

  const output = backticks_quiet`ldd ${file}`;

  for (const line of output.split("\n")) {
    if (!line.includes("=>")) continue;
    const [basename, fullpath] = line.trim().split(/\s+=>\s+/);

    if (fullpath.startsWith("/lib/")) continue;
    if (/linux-vdso.so.\d+/.test(basename)) continue;

    //FIXME
    if (/libstdc\+\+.so.\d+/.test(basename)) continue;

    const lib = new Path(fullpath.replace(/\s+\(0x[0-9a-f]+\)/, "")).realpath();
    libs.push(lib.string);
  }
  return libs;
}
