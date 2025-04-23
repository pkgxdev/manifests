import { SemVer } from "brewkit";

export default async function (project: string, basename = project) {
  const rsp = await fetch(`https://ftpmirror.gnu.org/gnu/${project}/`);
  const txt = await rsp.text();
  const matches = txt.matchAll(new RegExp(`${basename}-(\\d+(\\.\\d+)+)\\.tar\\.gz`, "mg"));
  const rv = [];
  for (const match of matches) {
    const tag = match[1];
    const version = new SemVer(match[1]);
    rv.push({ version, tag });
  }
  return rv;
}
