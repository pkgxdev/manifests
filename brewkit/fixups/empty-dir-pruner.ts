import Path from "../path.ts";

export class EmptyDirectoryPruner {
  candidates: Set<string> = new Set();
  symlink_candidates: Set<string> = new Set();

  add(p: Path, opts: {isDirectory: boolean, isSymlink: boolean}) {
    if (opts.isDirectory) {
      this.candidates.add(p.string);
    }
    if (opts.isSymlink) {
      this.symlink_candidates.add(p.string);
    }
  }

  async execute() {
    for (const dir of this.candidates) {
      if (new Path(dir).isDirectory()) {
        try {
          Deno.removeSync(dir);
        } catch {}
      }
    }
    for (const link of this.symlink_candidates) {
      if (!new Path(link).readlink().exists()) {
        try {
          Deno.removeSync(link);
        } catch {}
      }
    }
  }
}
