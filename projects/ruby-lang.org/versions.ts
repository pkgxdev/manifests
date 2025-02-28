import { github, semver } from "brewkit";

export default async function () {
  return (await github.tags("ruby/ruby")).compact(
    ({ name: tag }) => {
      const version = semver.parse(tag.replaceAll("_", "."));
      return version && { tag, version };
    },
  );
}
