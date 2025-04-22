import { Range, SemVer } from "brewkit";

export default async function (constraint: Range) {
  const rsp = await fetch('http://ftp.videolan.org/pub/videolan/x265/')
  const txt = await rsp.text();
  const rx = /x265_(\d+(\.\d+))\.tar\.gz/g;

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
