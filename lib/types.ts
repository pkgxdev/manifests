import { Range } from "jsr:@std/semver@^1";

export interface PackageRequirement {
  project: string;
  constraint: Range;
}
