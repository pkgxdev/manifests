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

class InstallablePath extends Path {
  constructor(path: Path) {
    super(path);
  }

  install(src: Path | string) {
    src = src instanceof Path ? src : Path.cwd().join(src);
    src.mv({ into: this.mkdir("p") });
  }
}

class Prefix extends Path {
  bin: InstallablePath;
  lib: InstallablePath;
  share: InstallablePath;

  constructor(prefix: Path) {
    super(prefix);
    this.bin = new InstallablePath(prefix.join("bin"));
    this.lib = new InstallablePath(prefix.join("lib"));
    this.share = new InstallablePath(prefix.join("share"));
  }
}

interface BuildOptions {
  prefix: Prefix;
  version: SemVer & { marketing: string };
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
export { Prefix };

type Falsy = false | 0 | "" | null | undefined;

declare global {
  interface Array<T> {
    compact<S>(body?: (t: T) => S | Falsy, opts?: { rescue: boolean }): S[];
    uniq(): Array<T>;
  }
}

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

export function flatmap<S, T>(
  t: T | Falsy,
  body: (t: T) => S | Falsy,
  opts?: { rescue: boolean },
): S | undefined;
export function flatmap<S, T>(
  t: Promise<T | Falsy>,
  body: (t: T) => Promise<S | Falsy>,
  opts?: { rescue: boolean },
): Promise<S | undefined>;
export function flatmap<S, T>(
  t: Promise<T | Falsy> | (T | Falsy),
  body: (t: T) => (S | Falsy) | Promise<S | Falsy>,
  opts?: { rescue: boolean },
): Promise<S | undefined> | (S | undefined) {
  try {
    if (t instanceof Promise) {
      const foo = t.then((t) => {
        if (!t) return;
        const s = body(t) as Promise<S | Falsy>;
        if (!s) return;
        const bar = s.then((body) => body || undefined);
        if (opts?.rescue) {
          return bar.catch(() => {
            return undefined;
          });
        } else {
          return bar;
        }
      });
      return foo;
    } else {
      if (t) return body(t) as (S | Falsy) || undefined;
    }
  } catch (err) {
    if (!opts?.rescue) throw err;
  }
}

import fixup from "./fixup.ts";
export { fixup };

export function inreplace(path: Path | string, from: string | RegExp, to: string) {
  path = path instanceof Path ? path : Path.cwd().join(path);
  console.error(`%c+`, "color:yellow", "inreplace", path);
  Deno.writeTextFileSync(
    path.string,
    Deno.readTextFileSync(path.string).replaceAll(from, to),
  );
}

import undent from "https://deno.land/x/outdent@v0.8.0/mod.ts";
export { undent };

import env_include, { stub } from "./env-include.ts";
export { env_include, stub };

import default_versions from "./default-versions.ts";
export { default_versions };
