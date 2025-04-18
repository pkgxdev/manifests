import { SemVer } from "brewkit";

export default async function() {
  const rsp = await fetch('https://gnupg.org/ftp/gcrypt/libgpg-error/');
  const txt = await rsp.text();
  const matches = txt.matchAll(/libgpg-error-(\d+(\.\d+)+)\.tar\.gz/g);
  const rv = []
  for (const m of matches) {
    rv.push({
      tag: m[1],
      version: new SemVer(m[1])
    });
  }
  return rv;
}
