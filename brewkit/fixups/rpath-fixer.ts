import { backticks_quiet, Path, run } from "brewkit";
import { fromFileUrl } from "jsr:@std/path@^1.0.8";

export default class RpathFixer {
  files: Path[] = [];
  prefix: Path;
  PKGX_DIR: Path;
  deps_prefixes: Path[];

  constructor(prefix: Path, deps: Path[], PKGX_DIR: Path) {
    this.deps_prefixes = deps;
    this.prefix = prefix;
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
          console.error('%c+', 'color:pink', 'fixing rpaths:', file);
          await this.execute_linux(file);
        }
        break;

      case "darwin": {
        const script = new Path(fromFileUrl(import.meta.url)).join(
          "../../scripts/fix-macho.rb",
        );

        Deno.env.set("GEM_HOME", "/tmp/gem");

        for (const file of this.files) {
          console.error('%c+', 'color:yellow', 'fixing rpaths:', file);
          Deno.env.set("LIBS", JSON.stringify(this.files));
          run`${script} ${file} ${this.prefix} ${this.PKGX_DIR}`;
        }
      }
    }
  }

  async execute_linux(file: Path) {
    let rpaths: string[] = [];

    const LDLPATH = [
      this.prefix.join("lib"),
      ...this.deps_prefixes.map((prefix) => prefix.join("lib")),
    ].join(":");

    for (const linked_lib of ldd(file, LDLPATH)) {
      let rpath = "";
      if (linked_lib.startsWith(this.prefix.string)) {
        rpath = new Path(linked_lib).parent().relative({
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
        console.error(`::error::could not fix: ${file} dep: ${linked_lib}`);
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

    rpaths = rpaths.uniq().map((rpath) => `$ORIGIN/${rpath || "."}`);

    if (rpaths.length) {
      run`patchelf --set-rpath ${rpaths.join(":")} ${file}`;
    } else {
      run`patchelf --remove-rpath ${file}`;
    }
  }
}

function ldd(file: Path, LDLPATH: string): string[] {
  const libs: string[] = [];

  const old_LDLPATH = Deno.env.get("LD_LIBRARY_PATH");
  Deno.env.set("LD_LIBRARY_PATH", LDLPATH);
  let output = '';
  try {
    output = backticks_quiet`ldd ${file}`;
  } finally {
    if (old_LDLPATH) {
      Deno.env.set("LD_LIBRARY_PATH", old_LDLPATH);
    } else {
      Deno.env.delete("LD_LIBRARY_PATH");
    }
  }

  for (const line of output.split("\n")) {
    if (!line.includes("=>")) continue;
    const [basename, fullpath] = line.trim().split(/\s+=>\s+/);

    if (fullpath.startsWith("/lib/")) {
      switch (basename.replace(/\.\d+$/, "")) {
        case "libpthread.so":
        case "librt.so":
        case "libdl.so":
        case "libm.so":
        case "libc.so":
        case "libgcc_s.so":
          continue;  // these are still mandatory pre-requisites from the user’s system
      }
    }
    if (/linux-vdso.so.\d+/.test(basename)) continue;;

    let lib = new Path(fullpath.replace(/\s+\(0x[0-9a-f]+\)/, ""));
    while (lib.isSymlink()) {
      lib = lib.readlink();
    }
    libs.push(lib.string);
  }

  return libs;
}
