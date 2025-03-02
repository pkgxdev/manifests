import { github, semver } from "brewkit";

export default async function () {
  return (await github.tags("akimd/bison")).compact(({ name: tag }) => {
    const version = semver.parse(tag);
    if (version) {
      return {
        tag,
        version,
      };
    }
  });
}
