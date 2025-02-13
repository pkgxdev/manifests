import { github, Range, SemVer } from "brewkit";

export default async function (constraint: Range) {
  return (await github.releases("madler/zlib", constraint)).map(
    ({ tag_name: tag }) => {
      const version = new SemVer(tag);
      return { tag, version };
    },
  );
}
