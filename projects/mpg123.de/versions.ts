import { SemVer } from "brewkit";

export default async function() {
  const rsp = await fetch('https://www.mpg123.de/download/');
  const txt = await rsp.text();
  const matches = txt.matchAll(/mpg123-(\d+(\.\d+)+)\.tar\.bz2/g);
  const rv = []
  for (const m of matches) {
    rv.push({
      tag: m[1],
      version: new SemVer(m[1])
    });
  }
  return rv;
}
