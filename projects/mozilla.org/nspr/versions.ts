import { SemVer } from "brewkit";

export default async function() {
  const rsp = await fetch('https://archive.mozilla.org/pub/nspr/releases/');
  const txt = await rsp.text();
  const matches = txt.matchAll(/(v\d+(\.\d+)+)/g);
  const rv = []
  for (const m of matches) {
    rv.push({
      tag: m[1],
      version: new SemVer(m[1])
    });
  }
  return rv;
}
