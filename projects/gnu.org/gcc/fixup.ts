import { Path } from "brewkit";

export default function (path: Path): boolean {
  return path.extname() != ".a";
}
