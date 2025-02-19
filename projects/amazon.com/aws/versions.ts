import { github, Range, semver } from "brewkit";

export default async function (constraint: Range) {
  const rv = [];
  const tags = await github.tags("aws/aws-cli");
  for (const { name: tag } of tags) {
    const version = semver.parse(tag);
    if (version) {
      rv.push({ tag, version });
    }
  }
  return rv;
}
