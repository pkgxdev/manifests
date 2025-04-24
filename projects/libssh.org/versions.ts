import { SemVer } from "brewkit";

export default async function() {
  const rsp = await fetch('https://git.libssh.org/projects/libssh.git/refs/tags');
  const txt = await rsp.text();
  const matches = txt.matchAll(/libssh-(\d+(\.\d+)+)\.tar\.gz/g);
  const rv = []
  for (const m of matches) {
    rv.push({
      tag: m[1],
      version: new SemVer(m[1])
    });
  }
  return rv;
}
