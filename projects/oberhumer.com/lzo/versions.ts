import { SemVer } from "brewkit";

export default async function() {
  const rsp = await fetch('https://www.oberhumer.com/opensource/lzo/download/');
  const txt = await rsp.text();
  const matches = txt.matchAll(/lzo-(\d+(\.\d+)+)\.tar\.gz/g);
  const rv = []
  for (const m of matches) {
    rv.push({
      tag: m[1],
      version: new SemVer(m[1])
    });
  }
  return rv;
}
