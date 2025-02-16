import { github, Range, SemVer } from "brewkit";

export default async function (constraint: Range) {
  if (Deno.build.os == "windows") {
    return (await github.releases("git-for-windows/git", constraint)).map(({ tag_name }) => {
      const vstr = tag_name.replace(/\.windows\.\d+$/, "");
      return { tag: tag_name, version: new SemVer(vstr) };
    });
  }
  return (await github.tags("git/git")).map((x) => {
    try {
      if (!x.name.startsWith("v") || /-.*$/.test(x.name)) {
        // ignore tags for other products eg. gitgui
        return;
      }
      return github.std_version_covert(x);
    } catch (err) {
      if (!/^v[01]/.test(x.name)) {
        // ^^ ignore weird old tags
        throw err;
      }
    }
  }).filter((x) => x);
}
