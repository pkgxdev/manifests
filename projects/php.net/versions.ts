import { github, Range, semver } from "brewkit";

export default async function (constraint: Range) {
  const rv = [];
  const versions = await github.releases("php/php-src", constraint);
  for (const { tag_name } of versions) {
    const version = semver.parse(tag_name.replace(/^php-/, ""));
    if (version) {
      rv.push({ tag: tag_name, version });
    }
  }
  return rv;
}
