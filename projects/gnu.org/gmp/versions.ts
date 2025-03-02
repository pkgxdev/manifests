import { SemVer } from "brewkit";

export default async function () {
  const rsp = await fetch("https://gmplib.org/download/gmp/");
  const txt = await rsp.text();
  const matches = txt.matchAll(/(gmp-(\d+(\.\d+)+))\.tar\.bz2/mg);
  const rv = [];
  for (const match of matches) {
    const tag = match[1];
    const version = new SemVer(match[2]);
    rv.push({ version, tag });
  }
  return rv;
}
