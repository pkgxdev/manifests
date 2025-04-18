import { github, Range } from "brewkit";

export default async function (constraint: Range) {
  return (await github.releases("Kitware/CMake", constraint)).compact(
    github.std_version_convert,
  );
}
