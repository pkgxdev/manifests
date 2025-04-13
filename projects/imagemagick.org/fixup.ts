import { Path } from "brewkit";

export default function (path: Path): boolean {
  // the libtool archives are required for the module system to work
  return path.extname() != ".la";
}
