import Path from "../path.ts";

export class EmptyDirectoryPruner {
  candidates: Set<string> = new Set();

  add(p: Path, isDirectory: boolean) {
    if (isDirectory) {
      this.candidates.add(p.string);
    }
  }

  async execute() {
    for (const dir of this.candidates) {
      if (new Path(dir).isDirectory()) {
        try {
          await Deno.remove(dir);
        } catch {}
      }
    }
  }
}
