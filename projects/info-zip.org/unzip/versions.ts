import { SemVer } from "brewkit";

export default function () {
  // hasn’t been updated in eons
  return [{ version: new SemVer("6.0.0"), tag: "6.0" }];
}
