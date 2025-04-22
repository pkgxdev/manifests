import { Path } from "brewkit";

export default function(path: Path) {
  // stripping the binaries seems to remove the `main` symbol lol
  return path.parent().basename() != "bin";
}
