import { Path } from "brewkit";

export default function (path: Path): boolean {
  if (path.extname() == ".a") {
    return !path.string.includes("++");
  } else {
    return true;
  }
}
