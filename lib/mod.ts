import { SemVer } from "jsr:@std/semver@^1";

import Path from "./path.ts";
export { Path };

import { parse } from "./parse.ts";
export { parse };

import * as github from "./github.ts";
export { github };

import run from "./run.ts";
export { run };

interface BuildOptions {
  prefix: Path;
  version: SemVer;
  tag: string;

  /// the directory with your `pkg.yml` and any other files you added there
  props: Path;
}
export type { BuildOptions };

import fix_shebang from "./fix-shebang.ts";
export { fix_shebang };

import unarchive from "./unarchive.ts";
export { unarchive };

import fixup from "./fixup.ts";
export { fixup };

import { PackageRequirement } from "./types.ts";
export type { PackageRequirement };

import * as test_utils from "./test-utils.ts";
export { test_utils };
