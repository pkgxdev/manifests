import { SemVer } from "brewkit";

export default async function() {
  const rsp = await fetch('https://aomedia.googlesource.com/aom/+refs');
  const txt = await rsp.text();
  const matches = txt.matchAll(/refs\/tags\/(v\d+(\.\d+)+)/g);
  const rv = []
  for (const m of matches) {
    rv.push({
      tag: m[1],
      version: new SemVer(m[1])
    });
  }
  return rv;
}
