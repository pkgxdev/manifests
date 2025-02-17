import { github, semver } from "brewkit";

export default async function () {
  return (await github.tags("autotools-mirror/m4")).compact(({ name }) => {
    if (/[a-z]$/.test(name)) return;
    if (/^m4-/.test(name)) name = name.slice(3);
    if (/^release-/.test(name)) name = name.slice(8);
    const version = semver.parse(name);
    if (version) {
      return {
        tag: name,
        version,
      };
    }
  });
}
