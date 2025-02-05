#!/usr/bin/env -S pkgx deno^2 run --allow-read --allow-run

import { run } from "brewkit";
import {
  PackageRequirement,
  utils,
} from "https://deno.land/x/libpkgx@v0.20.3/mod.ts";
import { parse } from "jsr:@std/yaml@^1";

const pkg = utils.pkg.parse(Deno.args[0]);
const deps = get_deps(pkg);

if (deps.length == 0) Deno.exit(0);

const plus = deps.map((dep) => `+${utils.pkg.str(dep)}`).join(" ");
run`pkgx ${plus}`;

interface YAMLType {
  dependencies?: string | string[] | Record<string, string>;
  windows?: { dependencies?: string | string[] | Record<string, string> };
  darwin?: { dependencies?: string | string[] | Record<string, string> };
  linux?: { dependencies?: string | string[] | Record<string, string> };
}

function get_deps(pkg: PackageRequirement) {
  const yamlfile =
    new URL(`../../projects/${pkg.project}/package.yml`, import.meta.url)
      .pathname;
  const yaml = parse(Deno.readTextFileSync(yamlfile)) as YAMLType | undefined;
  const deps: PackageRequirement[] = [];
  const os = Deno.build.os as "windows" | "darwin" | "linux";

  deps.push(...parse_node(yaml?.dependencies));
  deps.push(...parse_node(yaml?.[os]?.dependencies));

  return deps;
}

function parse_node(node: unknown) {
  if (typeof node === "string") {
    return node.split(/\s+/).map(utils.pkg.parse);
  } else if (Array.isArray(node)) {
    return node.map(utils.pkg.parse);
  } else if (node) {
    return Object.entries(node).map(([name, constraint]) =>
      utils.pkg.parse(`${name}${constraint}`)
    );
  }
  {
    return [];
  }
}
