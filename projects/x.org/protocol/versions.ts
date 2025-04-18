import { SemVer } from "brewkit";

export default async function() {
  const rsp = await fetch('https://www.x.org/archive/individual/proto/');
  const txt = await rsp.text();
  const matches = txt.matchAll(/xorgproto-(\d+(\.\d+)+)\.tar\.gz/g);
  const rv = []
  for (const m of matches) {
    rv.push({
      tag: m[1],
      version: new SemVer(m[1])
    });
  }
  return rv;
}
