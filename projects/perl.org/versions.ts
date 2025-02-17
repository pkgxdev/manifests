import { github, Range, SemVer, semver } from "brewkit";

export default async function () {
  return (await github.tags("perl/perl5")).compact(({ name: tag }) => {
    const version = semver.parse(tag);
    if (version && version.minor % 2 == 0) {
      // ^^ perl odd minor releases are testing releases
      return { version, tag };
    }
  });
}
