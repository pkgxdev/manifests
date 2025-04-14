import { Path } from "brewkit";

export default function(path: Path) {
  return path.extname() != '.a';
}
