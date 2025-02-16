import { github, semver } from "brewkit";

export default async function () {
  return (await github.tags("libarchive/bzip2")).compact(
    ({ name: tag }) => {
      tag = tag.replace(/^bzip2-/, "");
      const version = semver.parse(tag);
      return version && { tag, version };
    },
  );
}
