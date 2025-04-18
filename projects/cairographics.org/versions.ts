import { SemVer } from "brewkit";

export default async function() {
  const rsp = await fetch('https://cairographics.org/releases/');
  const txt = await rsp.text();
  const matches = txt.matchAll(/cairo-(\d+\.\d+(\.\d+)?)\.tar\.xz/g);
  const rv = []
  for (const m of matches) {
    rv.push({
      tag: m[1],
      version: new SemVer(m[1])
    });
  }
  return rv;
}
