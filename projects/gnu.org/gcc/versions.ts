import { github, semver } from "brewkit";

export default async function () {
  return (await github.tags("gcc-mirror/gcc")).compact(({ name: tag }) => {
    const version = semver.parse(tag.replace(/^releases\/gcc-/, ""));
    if (version) {
      return {
        tag,
        version,
      };
    }
  });
}
