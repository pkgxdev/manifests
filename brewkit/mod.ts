import Path from "./path.ts";
export { Path };

import { parse } from "https://deno.land/x/libpkgx@v0.20.3/src/utils/pkg.ts";
export { parse };

import * as github from "./github.ts";
export { github };

import run, { backticks, backticks_quiet } from "./run.ts";
export { backticks, backticks_quiet, run };

import unarchive from "./unarchive.ts";
export { unarchive };

import { PackageRequirement } from "https://deno.land/x/libpkgx@v0.20.3/src/types.ts";
export type { PackageRequirement };

import * as test_utils from "./test-utils.ts";
export { test_utils };

import SemVer, {
  compare,
  intersect,
  parse as semver_parse,
  Range,
} from "https://deno.land/x/libpkgx@v0.20.3/src/utils/semver.ts";

function intersects(a: Range, b: Range) {
  try {
    semver.intersect(a, b);
    return true;
  } catch {
    return false;
  }
}

const semver = { intersect, intersects, compare, parse: semver_parse };

export { Range, SemVer, semver };

interface BuildOptions {
  prefix: Path;
  version: SemVer;
  tag: string;

  /// the directory with your `package.yml` and any other files you added there
  props: Path;

  // where your deps are installed and your built package will be moved after `build()`
  PKGX_DIR: Path;

  deps: Record<string, {
    version: SemVer;
    prefix: Path;
  }>;
}

interface TestOptions {
  version: SemVer;
  prefix: Path;
}

export type { BuildOptions, TestOptions };

type Falsy = false | 0 | "" | null | undefined;

Array.prototype.compact = function <T, S>(
  body?: (t: T) => S | Falsy,
  opts?: { rescue: boolean },
): S[] {
  const rv: S[] = [];
  for (const e of this) {
    try {
      const f = body ? body(e) : e;
      if (f) rv.push(f);
    } catch (err) {
      if (opts === undefined || opts.rescue === false) throw err;
    }
  }
  return rv;
};

Array.prototype.uniq = function <T>(): Array<T> {
  const set = new Set<T>();
  return this.compact((x) => {
    const s = x.toString();
    if (set.has(s)) return;
    set.add(s);
    return x;
  });
};

import fixup from "./default-fixup.ts";
export { fixup };

export function inreplace(path: Path, from: string | RegExp, to: string) {
  console.error(`%c+`, "color:yellow", "inreplace", path);
  Deno.writeTextFileSync(
    path.string,
    Deno.readTextFileSync(path.string).replaceAll(from, to),
  );
}

export function undent(
  strings: TemplateStringsArray,
  ...values: any[]
): string {
  const raw = strings.raw;
  let result = raw.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");

  const lines = result.split("\n");
  const minIndent = Math.min(
    ...lines.filter((line) => line.trim()).map((line) =>
      line.match(/^\s*/)?.[0].length ?? 0
    ),
  );

  return lines.map((line) => line.slice(minIndent)).join("\n").trim();
}
