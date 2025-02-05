#!/usr/bin/env -S pkgx deno^2 run --allow-read --allow-run

import {
  PackageRequirement,
  utils,
} from "https://deno.land/x/libpkgx@v0.20.3/mod.ts";
import { parse } from "jsr:@std/yaml@^1";

const pkg = utils.pkg.parse(Deno.args[0]);
const {deps, env: runtime_env} = get_data(pkg);

if (deps.length == 0) Deno.exit(0);

const plus = deps.map((dep) => {
  let str = utils.pkg.str(dep);
  // bug in pkgx^2 where `*` is invalid :/
  if (str.endsWith("*")) str = str.slice(0, -1);
  return `+${str}`;
});

const proc = await new Deno.Command("pkgx", {
  args: ["--json=v1", ...plus],
  stdout: "piped",
}).spawn();
const { success, code } = await proc.status;
if (!success) {
  console.error("fetching deps failed!");
  Deno.exit(code);
}
const stdout = new TextDecoder().decode((await proc.output()).stdout);

if (stdout) {
  const json = JSON.parse(stdout);

  for (const [key, paths] of Object.entries(json.env) as [string, string[]][]) {
    console.log(`export ${key}="${paths.join(":")}\${${key}:+:\$${key}}"`);
  }

  for (const [key, value] of Object.entries(runtime_env)) {
    console.log(`export ${key}="${value}"`);
  }
}

interface YAMLType {
  dependencies?: string | string[] | Record<string, string>;
  companions?: string | string[] | Record<string, string>;
  env?: Record<string, string>;
  windows?: {
    dependencies?: string | string[] | Record<string, string>;
    companions?: string | string[] | Record<string, string>;
    env?: Record<string, string>;
  };
  darwin?: {
    dependencies?: string | string[] | Record<string, string>;
    companions?: string | string[] | Record<string, string>;
    env?: Record<string, string>;
  };
  linux?: {
    dependencies?: string | string[] | Record<string, string>;
    companions?: string | string[] | Record<string, string>;
    env?: Record<string, string>;
  };
}

function get_data(pkg: PackageRequirement) {
  const yamlfile =
    new URL(`../../projects/${pkg.project}/package.yml`, import.meta.url)
      .pathname;
  const yaml = parse(Deno.readTextFileSync(yamlfile)) as YAMLType | undefined;
  const deps: PackageRequirement[] = [];
  const os = Deno.build.os as "windows" | "darwin" | "linux";

  deps.push(...parse_node(yaml?.dependencies));
  deps.push(...parse_node(yaml?.[os]?.dependencies));
  deps.push(...parse_node(yaml?.companions));
  deps.push(...parse_node(yaml?.[os]?.companions));

  const env = {
    ...yaml?.env, ...yaml?.[os]?.env
  }

  return {deps, env};
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
