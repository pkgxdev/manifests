import { github, Range, SemVer } from "brewkit";

export default async function(constraint: Range) {
  if (constraint.satisfies(new SemVer("21.0.0"))) {
    return (await github.tags("openjdk/jdk21u")).compact(({ name: tag }) => {
      // ga = general availability, the other +[0-9] tags are pre-releases
      if (tag.endsWith("-ga")) {
        const vstr = tag.replace(/^jdk-/, "").replace(/-ga$/, "");
        const version = new SemVer(vstr);
        return {version, tag}
      }
    })
  } else {
    throw new Error("Unsupported version");
  }
}