import { github, semver } from "brewkit";

export default async function () {
  return (await github.tags("mirror/ncurses")).compact(
    ({ name: tag }) => {
      const version = semver.parse(tag);
      return { tag, version };
    },
  );
}
