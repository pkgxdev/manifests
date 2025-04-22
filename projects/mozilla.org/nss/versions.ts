import { SemVer } from "brewkit";

export default async function() {
  const rsp = await fetch('https://ftp.mozilla.org/pub/security/nss/releases/');
  const txt = await rsp.text();
  const matches = txt.matchAll(/NSS_(\d+)_(\d+)_RTM/g);
  const rv = []
  for (const m of matches) {
    rv.push({
      tag: m[0],
      version: new SemVer(`${m[1]}.${m[2]}`),
    });
  }
  return rv;
}
