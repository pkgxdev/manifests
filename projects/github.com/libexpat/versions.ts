import { github, Range, semver } from "brewkit";

export default async function (constraint: Range) {
  return (await github.releases("libexpat/libexpat", constraint)).compact(
    ({ tag_name: tag }) => {
      const version = semver.parse(tag.replace(/^R_/, "").replaceAll("_", "."));
      if (version) {
        return { version, tag };
      }
    },
  );
}
