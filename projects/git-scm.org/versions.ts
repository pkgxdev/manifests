import { Range } from "jsr:@std/semver@^1";
import { github } from "brewkit";

export default async function (constraint: Range) {
  return (await github.tags("git/git")).map((x) => {
    try {
      if (!x.name.startsWith("v")) {
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
