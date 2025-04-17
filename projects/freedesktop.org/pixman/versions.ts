import { gitlab, semver } from "brewkit";

export default async function() {
    const rv = []
    const g = gitlab({ server: 'gitlab.freedesktop.org', project: 'pixman/pixman', type: 'tags' });
    for await (let { version: tag } of g) {
      tag = tag.replace(/^pixman-/, '');
      const version = semver.parse(tag);
      if (version) {
        rv.push({ version, tag });
      }
    }
    return rv;
}