import { github, SemVer, semver } from "brewkit";

export default async function () {
  const rsp = await fetch(`https://www.sqlite.org/chronology.html`);
  const txt = await rsp.text();
  //<tr>
  //  <td width='100' align='center' data-sortkey='08952'><a href='https://www.sqlite.org/src/timeline?c=873d4e274b&y=ci'>2025-02-18</a></td>
  //  <td width='100' align='center' data-sortkey='3490100'><a href="releaselog/3_49_1.html">3.49.1</a></td>
  // </tr>
  const years = txt.matchAll(/(\d\d\d\d)-\d\d-\d\d/g)!.map(([, year]) => year).toArray();
  const tags = txt.matchAll(/data-sortkey='(\d\d\d\d\d\d\d)'/g)!.map((m) => m[1]).toArray();
  const versions = txt.matchAll(/>(\d+\.\d+\.\d+)<\/a>/g)!.map((m) => m[1]).toArray();
  // zip them all together
  return versions.map((version, i) => {
    return {
      version: new SemVer(version),
      year: years[i],
      tag: tags[i],
    };
  });
}
