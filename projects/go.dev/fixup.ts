import { Path } from "brewkit";

export default function (path: Path) {
  // stripping fails for  plenty of stuff in `src`
  if (path.components().includes("src")) return false;
  // these go binaries are ”not dynamic executables” and thus `ldd` fails to inspect them!
  if (path.parent().basename() == "bin") return false;
  if (path.basename() == "doc") return false;
  if (path.string.includes("pkg/tool/linux_")) return false;
  return true;
}
