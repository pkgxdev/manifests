import { Path, run, SemVer } from "brewkit";

export default async function (prefix: Path, version: SemVer) {
  run`curl -i pkgx.sh`;
  run`curl --proto =https --tlsv1.2 -sSf https://get-ghcup.haskell.org`;
}
