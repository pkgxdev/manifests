import { github, Range } from "brewkit";

export default async function (constraint: Range) {
  return (await github.releases("adah1972/libunibreak", constraint)).compact(({ tag_name, name }) => {
    tag_name = tag_name.replace(/^libunibreak_/, "").replace('_', ".");
    return github.std_version_convert({tag_name, name});
  });
}
