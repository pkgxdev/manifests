import { SemVer } from "brewkit";

export default async function () {
  const rsp = await fetch("https://ijg.org/files/");
  const txt = await rsp.text();
  const rx = /jpegsrc\.(v\d+[a-z])?\.tar\.gz/g;

  const rv = [];
  for (const match of txt.matchAll(rx)) {
    const [_, tag] = match;
    rv.push({
      version: new SemVer(tag),
      tag,
    });
  }

  return rv;
}
