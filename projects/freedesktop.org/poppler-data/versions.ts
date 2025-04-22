import { gitlab, semver } from "brewkit";

export default async function() {
    const rv = []
    const g = gitlab({ server: 'gitlab.freedesktop.org', project: 'poppler/poppler-data', type: 'tags' });
    for await (let { version: tag } of g) {
      tag = tag.replace(/^POPPLER_DATA_/, '').replaceAll("_", ".");
      const version = semver.parse(tag);
      if (version) {
        rv.push({ version, tag });
      }
    }
    return rv;
}