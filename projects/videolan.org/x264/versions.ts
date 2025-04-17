import { SemVer } from "brewkit";

export default async function() {
  const rsp = await fetch('https://artifacts.videolan.org/x264/release-macos-arm64/');
  const text = await rsp.text();
  const regex = /x264-r(\d+)-([0-9a-f]+)/g;
  const matches = [...text.matchAll(regex)];
  const versions = matches.map(mapper);
  return versions;
}

function mapper(input: RegExpMatchArray) {
  const b = parseInt(input[1]);
  const version = new SemVer(`${b/100}.${b%100}`);
  return {
    version, tag: `r${input[1]}`, sha: input[2]
  }
}
