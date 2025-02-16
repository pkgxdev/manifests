import { github, semver } from "brewkit";

export default async function () {
  return (await github.tags("python/cpython")).compact(({ name: tag }) => {
    const version = semver.parse(tag);
    if (version) {
      return { version, tag };
    }
  });
}
