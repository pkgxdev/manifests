import { Range, semver, gitlab } from "brewkit";

export default async function (constraint: Range) {
  if (constraint.toString() == "*") {

    // freedesktop feel it is useful to publish releases that aren’t actual releases
    // the only way to know if a release is proper and thus there is a tarball is try
    // to download it. For the latest stable release thoguh we can scrape the homepage.

    const rsp = await fetch('https://www.freedesktop.org/wiki/Software/fontconfig/')
    const txt = await rsp.text();
    const tag = txt.match(/The current stable series is (\d+\.\d+\.\d+)/)![1];
    const version = semver.parse(tag);
    return [{ version, tag }];
  }

  const rv = []
  const g = gitlab({ server: 'gitlab.freedesktop.org', project: 'fontconfig/fontconfig', type: 'tags' });
  for await (const { version: tag } of g) {
    const version = semver.parse(tag);
    if (version) {
      rv.push({ version, tag });
    }
  }
  return rv;
}
