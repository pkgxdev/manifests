import { github, semver } from "brewkit";

export default async function () {
  const rv = [];
  const tags = await github.tags("krb5/krb5");
  for (let { name: tag } of tags) {
    tag = tag.replace(/-final$/, "");
    const version = semver.parse(tag.replace(/^krb5-/, ""));
    if (version) {
      rv.push({ tag, version });
    }
  }
  return rv;
}
