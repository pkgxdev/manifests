import { SemVer } from "brewkit";

export default async function(project: string) {
  const rsp = await fetch(`https://gnupg.org/ftp/gcrypt/${project}/`);
  const txt = await rsp.text();
  const matches = txt.matchAll(new RegExp(`${project}-(\\d+(\\.\\d+)+)\\.tar\\.(bz2|gz)`, 'g'));
  const rv = []
  for (const m of matches) {
    rv.push({
      tag: m[1],
      version: new SemVer(m[1])
    });
  }
  return rv;
}
