import Path from "../path.ts";

export default class RehardLinker {
  inos: Record<number, string> = {};
  paths: Record<string, string[]> = {};

  push(path: Path) {
    // zero is an impossible inode value
    const ino = Deno.statSync(path.string)?.ino ?? 0;

    if (!(ino in this.inos)) {
      this.inos[ino] = path.string;
      this.paths[path.string] = [];
      return true;
    } else {
      this.paths[this.inos[ino]].push(path.string);
      return false;
    }
  }

  async execute() {
    for (const [oldpath, newpaths] of Object.entries(this.paths)) {
      for (const newpath of newpaths) {
        console.error(
          "%c+",
          "color:yellow",
          "re-hardlinking",
          oldpath,
          "to",
          newpath,
        );
        await Deno.remove(newpath);
        await Deno.link(oldpath, newpath);
      }
    }
  }
}
