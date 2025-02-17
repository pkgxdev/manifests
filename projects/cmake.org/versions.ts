import { github, Range } from "brewkit";

export default async function (constraint: Range) {
  return (await github.releases("Kitware/CMake", constraint)).map(
    github.std_version_covert,
  );
}
