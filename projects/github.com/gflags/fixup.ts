import { Path } from "brewkit";

export default function(path: Path) {
  // glog can only link to this statically
  return path.extname() != ".a";
}
