import { Path } from "brewkit";

export default function (path: Path) {
  if (path.extname() == ".a") {
    // the cmake files this package provide fail if the static libs are not
    // there we can patch those cmake files but we do not have great resilience
    // to patching at this time. It is safer to ship them even though this only
    // effects builds.
    return false;
  } else {
    return true;
  }
}