import { github, semver } from "brewkit";
import SemVer from "https://deno.land/x/libpkgx@v0.20.3/src/utils/semver.ts";

export default async function () {
  return (await github.tags("pypa/pip")).compact(({ name: tag }) => {
    const version = semver.parse(tag);
    // the major prior to 18 is 10, which is ancient and doesn't currently work
    if (version && version.gt(new SemVer("10"))) {
      return { version, tag };
    }
  });
}
