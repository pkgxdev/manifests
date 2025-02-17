import { SemVer } from "brewkit";

export default function () {
  //TODO gitlab API
  return [{ version: new SemVer("0.29.2"), tag: "pkg-config-0.29.2" }];
}
