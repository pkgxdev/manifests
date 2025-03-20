import { github, semver } from "brewkit";

export default async function () {
  return (await github.tags("golang/go")).compact(
    ({ name: tag }) => {
      tag = tag.replace(/^go/, "");
      const version = semver.parse(tag);
      if (version) {
        return { tag, version };
      }
    },
  );
}
