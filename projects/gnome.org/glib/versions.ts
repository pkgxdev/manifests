import { Range, semver, gitlab } from "brewkit";

export default async function (constraint: Range) {
  const rv = []
  const g = gitlab({ server: 'gitlab.gnome.org', project: 'GNOME/glib', type: 'releases' });
  for await (const { version: tag } of g) {
    const version = semver.parse(tag);
    if (version) {
      rv.push({ version, tag });
    }
  }
  return rv;
}
