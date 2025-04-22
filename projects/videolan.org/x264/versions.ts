import { Range, SemVer } from "brewkit";

export default async function(constraint: Range) {
  if (constraint.toString() !== "*") {
    throw new Error("Can only currently handle version constraint: `*`");
  }

  let rsp = await fetch('https://artifacts.videolan.org/x264/release-macos-arm64/');
  const text = await rsp.text();
  const regex = /x264-r(\d+)-([0-9a-f]+)/g;
  const matches = [...text.matchAll(regex)];
  const {revision, sha} = matches.map(mapper)[0];

  rsp = await fetch(`https://code.videolan.org/videolan/x264/-/raw/${sha}/x264.h`);
  const txt = await rsp.text();

  const match = txt.match(/#define X264_BUILD (\d+)/);
  const minor = match![1]!;
  const version = new SemVer(`0.${minor}.${revision}`);

  return [{
    version, sha, tag: `r{revision}`
  }]
}

function mapper(input: RegExpMatchArray) {
  return {
    revision: input[1], sha: input[2]
  }
}
