import { parse, Range } from "jsr:@std/semver@^1";
import { github } from "brewkit";

export default async function (constraint: Range) {
  return (await github.releases("openssl/openssl", constraint)).map(
    ({ tag_name: tag }) => {
      const version = parse(tag.replace(/^openssl-/, ""));
      return { tag, version };
    },
  );
}
