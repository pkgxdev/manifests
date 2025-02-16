import { SemVer } from "brewkit";

export default async function () {
  const rsp = await fetch("https://curl.se/docs/caextract.html");
  const txt = await rsp.text();
  const rx = /cacert-(2\d+)-(\d+)-(\d+).pem/g;

  const rv = [];
  for (const match of txt.matchAll(rx)) {
    const [tag, major, minor, patch] = match;
    rv.push({
      version: new SemVer(
        `${parseInt(major)}.${parseInt(minor)}.${parseInt(patch)}`,
      ),
      tag: tag.replace(/.pem$/, ""),
    });
  }

  return rv;
}
