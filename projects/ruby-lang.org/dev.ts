import { Path } from "brewkit";

export default function (cwd: Path) {
  return cwd.join(".rubyversion").read();
}
