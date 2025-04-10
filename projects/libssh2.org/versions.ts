import { github, Range, SemVer } from "brewkit";

export default async function (constraint: Range) {
  return (await github.releases("libssh2/libssh2", constraint)).map(
    ({ tag_name: tag }) => {
      const s = tag.replace(/^libssh2-/, "").replaceAll("_", ".");
      const version = new SemVer(s);
      return { version, tag };
    },
  );
}
