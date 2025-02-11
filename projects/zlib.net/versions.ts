import { parse, Range } from "jsr:@std/semver@^1";
import { github } from "brewkit";

export default async function (constraint: Range) {
  return (await github.releases("madler/zlib", constraint)).map(
    ({ tag_name: tag }) => {
      const version = parse(tag);
      return { tag, version, raw: tag.slice(1) };
    },
  );
}
