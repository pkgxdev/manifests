import { SemVer } from "brewkit";

export default async function () {
  const rsp = await fetch("https://www.nasm.us/pub/nasm/releasebuilds/");
  const txt = await rsp.text();
  const matches = txt.matchAll(/"(\d+\.\d+(\.\d+))?\/"/mg);
  const rv = [];
  for (const match of matches) {
    const tag = match[1];
    const version = new SemVer(match[1]);
    rv.push({ version, tag });
  }
  return rv;
}
