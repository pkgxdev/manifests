import { github, semver, Range, SemVer } from "brewkit";

export default async function(constraint: Range) {
  // everything up until 8.45 is the original pcre
  // everything above 10 is “pcre2”

  if (semver.intersects(constraint, new Range(">=10"))) {
    const releases = await github.releases("PCRE2Project/pcre2", constraint);
    return releases.map(
      ({ tag_name: tag }) => {
        const s = tag.replace(/^pcre2-/, "").replaceAll("_", ".");
        const version = new SemVer(s);
        return { version, tag };
      },
    );

  } else {
    const rsp = await fetch(`https://sourceforge.net/projects/pcre/files/pcre/`);
    const txt = await rsp.text();
    const matches = txt.matchAll(/pcre\/(\d+\.\d+)/mg);
    const rv = [];
    for (const match of matches) {
      const tag = match[1];
      const version = new SemVer(match[1]);
      rv.push({ version, tag });
    }
    return rv;
  }
}