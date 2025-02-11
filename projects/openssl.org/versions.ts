import { github, Range, SemVer, semver } from "brewkit";

export default async function (constraint: Range) {
  const rv = []
  if (constraint.toString() != '*' && semver.intersects(constraint, new Range("^1"))) {
    const tags = await github.tags("openssl/openssl");
    for (const { name: tag } of tags) {
      const match = tag.match(/^OpenSSL_(\d+_\d+_\d+[a-z]?)$/);
      if (match) {
        const version = new SemVer(match[1].replace(/_/g, "."));
        rv.push({ tag, version });
      }
    }
  }
  if (semver.intersects(constraint, new Range(">=3"))) {
    const releases = await github.releases("openssl/openssl", constraint);
    for (const { tag_name: tag } of releases) {
      const version = new SemVer(tag.replace(/^openssl-/, ""));
      rv.push({ tag, version });
    }
  }
  return rv;
}
