import { SemVer } from "brewkit";

export default async function () {
  const rsp = await fetch("https://download.libsodium.org/libsodium/releases/");
  const txt = await rsp.text();
  const rx = /libsodium-(\d+\.\d+(\.\d+)?)\.tar\.gz/g;

  const rv = [];
  for (const match of txt.matchAll(rx)) {
    const [_, tag] = match;
    rv.push({
      version: new SemVer(tag),
      tag,
    });
  }

  return rv;
}
