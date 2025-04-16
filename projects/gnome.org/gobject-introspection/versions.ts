import { semver, gitlab } from "brewkit";

export default async function () {
  const rv = []
  const g = gitlab({ server: 'gitlab.gnome.org', project: 'GNOME/gobject-introspection', type: 'releases' });
  for await (const { version: tag } of g) {
    const version = semver.parse(tag);
    if (version) {
      rv.push({ version, tag });
    }
  }
  return rv;
}
