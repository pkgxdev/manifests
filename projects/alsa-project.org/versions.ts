import { SemVer } from "brewkit";

export default async function() {
  const rsp = await fetch('https://www.alsa-project.org/files/pub/lib/');
  const txt = await rsp.text();
  const matches = txt.matchAll(/alsa-lib-(\d+(\.\d+)+)\.tar\.bz2/g);
  const rv = []
  for (const m of matches) {
    rv.push({
      tag: m[1],
      version: new SemVer(m[1])
    });
  }
  return rv;
}
