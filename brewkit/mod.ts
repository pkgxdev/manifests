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

import { Package, PackageRequirement } from "https://deno.land/x/libpkgx@v0.20.3/src/types.ts";
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
  include: InstallablePath;

  constructor(prefix: Path) {
    super(prefix);
    this.bin = new InstallablePath(prefix.join("bin"));
    this.lib = new InstallablePath(prefix.join("lib"));
    this.share = new InstallablePath(prefix.join("share"));
    this.include = new InstallablePath(prefix.join("include"));
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
  const global = typeof from == "string" || from.flags.includes("g");
  const contents = Deno.readTextFileSync(path.string);
  Deno.writeTextFileSync(
    path.string,
    global ? contents.replaceAll(from, to) : contents.replace(from, to),
  );
}

import undent from "https://deno.land/x/outdent@v0.8.0/mod.ts";
export { undent };

import env_include, { ensure, stub } from "./env-include.ts";
export { ensure, env_include, stub };

import default_versions from "./default-versions.ts";
export { default_versions };

let active_pkg: Package | undefined;
function set_active_pkg(pkg: Package) {
  active_pkg = pkg;
}
export { active_pkg, set_active_pkg };

export function insert({ after, line, path }: { after: string; line: string; path: Path }) {
  let txt = path.read();
  const parts = txt.split(after);
  if (parts.length < 2) throw new Error("didn’t get 2 parts for insert()");
  txt = parts[0] + after + `${line}\n` + parts.slice(1).join(after);
  path.write(txt);
}

export function platform_partial_path() {
  const arch = Deno.build.arch == "x86_64" ? "x86-64" : Deno.build.arch;
  return `${Deno.build.os}/${arch}`;
}

import walk_pkgx_dir from "./walk-pkgx-dir.ts";
export { walk_pkgx_dir };
