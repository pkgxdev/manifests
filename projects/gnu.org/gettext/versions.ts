import { github, SemVer, semver } from "brewkit";

export default async function () {
  return (await github.tags("autotools-mirror/gettext")).compact(({ name: tag }) => {
    const version = semver.parse(tag);
    if (version) {
      return {
        tag,
        version,
      };
    }
  });
}
