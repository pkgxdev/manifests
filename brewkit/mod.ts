import Path from "./path.ts";
export { Path };

import { parse } from "https://deno.land/x/libpkgx@v0.20.3/src/utils/pkg.ts"
export { parse };

import * as github from "./github.ts";
export { github };

import run, { backticks, backticks_quiet } from "./run.ts";
export { backticks, backticks_quiet, run };

import fix_shebang from "./fix-shebang.ts";
export { fix_shebang };

import unarchive from "./unarchive.ts";
export { unarchive };

import { PackageRequirement } from "https://deno.land/x/libpkgx@v0.20.3/src/types.ts";
export type { PackageRequirement };

import * as test_utils from "./test-utils.ts";
export { test_utils };

import SemVer, { Range, intersect, compare } from "https://deno.land/x/libpkgx@v0.20.3/src/utils/semver.ts";

function intersects(a: Range, b: Range) {
  try {
    semver.intersect(a, b);
    return true
  } catch {
    return false
  }
}

const semver = { intersect, intersects, compare };

export { semver, Range, SemVer };

interface BuildOptions {
  prefix: Path;
  version: SemVer;
  tag: string;

  /// the directory with your `pkg.yml` and any other files you added there
  props: Path;
}
export type { BuildOptions };
