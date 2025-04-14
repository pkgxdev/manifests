import { github, Range, SemVer } from "brewkit";

export default async function (constraint: Range) {
  return (await github.releases("unicode-org/icu", constraint)).map(
    ({ tag_name: tag }) => {
      const s = tag.replace(/^release-/, "").replaceAll("-", ".");
      const version = new SemVer(s);
      return { version, tag };
    },
  );
}
