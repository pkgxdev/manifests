import { SemVer } from "brewkit";

export default async function(project: string) {
  const rsp = await fetch(`https://sourceforge.net/projects/${project}/files/`);
  const txt = await rsp.text();
  const matches = txt.matchAll(new RegExp(`${project}-(\\d+(\\.\\d+)+)\\.tar\\.`, 'mg'));
  const rv = [];
  for (const match of matches) {
    const tag = match[1];
    const version = new SemVer(match[1]);
    rv.push({ version, tag });
  }
  return rv;
}
