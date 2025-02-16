import { github, Range, SemVer, semver } from "brewkit";

export default async function (constraint: Range) {
  return (await github.releases("llvm/llvm-project", constraint)).compact(
    ({ tag_name: tag }) => {
      const version = semver.parse(tag.replace(/^llvmorg-/, ""));
      if (version) {
        return { version, tag };
      }
    },
  );
}
