import { github, Range, SemVer } from "brewkit";

export default async function (constraint: Range) {
  return (await github.releases("curl/curl", constraint)).map(
    ({ tag_name: tag }) => {
      const s = tag.replace(/^curl-/, "").replaceAll("_", ".");
      const version = new SemVer(s);
      return { version, tag };
    },
  );
}
