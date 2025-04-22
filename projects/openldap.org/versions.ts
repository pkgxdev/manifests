import { SemVer } from "brewkit";

export default async function() {
  const rsp = await fetch('https://www.openldap.org/software/download/OpenLDAP/openldap-release/');
  const txt = await rsp.text();
  const matches = txt.matchAll(/openldap-(\d+(\.\d+)+)\.tgz/g);
  const rv = []
  for (const m of matches) {
    rv.push({
      tag: m[1],
      version: new SemVer(m[1])
    });
  }
  return rv;
}
