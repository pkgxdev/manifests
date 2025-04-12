import { github, Range, SemVer } from "brewkit";

export default async function (constraint: Range) {
  return (await github.releases("libevent/libevent", constraint)).map(
    ({ tag_name: tag }) => {
      const s = tag.replace(/^release-/, "").replace(/-stable$/, '');
      const version = new SemVer(s);
      return { version, tag };
    },
  );
}
