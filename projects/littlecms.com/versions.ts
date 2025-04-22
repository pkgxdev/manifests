import { github, Range } from "brewkit";

export default async function (constraint: Range) {
  return (await github.releases("mm2/Little-CMS", constraint)).compact(({ name, tag_name }) => {
    tag_name = tag_name.replace(/^lcms/, "");
    return github.std_version_convert({ tag_name, name });
  });
}
