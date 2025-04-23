import { semver, gitlab } from "brewkit";

export default async function () {
  const rv = []
  const g = gitlab({ server: 'gitlab.gnome.org', project: 'GNOME/gdk-pixbuf', type: 'releases' });
  for await (let { version: tag } of g) {
    tag = tag.replace(/^GdkPixbuf\s*/, '').replace(/\s*\(stable\)$/, '');
    const version = semver.parse(tag.trim());
    if (version) {
      rv.push({ version, tag });
    }
  }
  return rv;
}
