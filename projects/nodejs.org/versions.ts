import { github, Range } from "brewkit";

export default async function () {
  // need to say >=0 because the github.releases function does a shortcut for `*` to get latest
  // but latest is usually odd numbered which we then filter out
  const rv = (await github.releases("nodejs/node", new Range(">=0"))).compact(github.std_version_covert);
  return rv.filter(({ version }) => version.major % 2 == 0);
}
