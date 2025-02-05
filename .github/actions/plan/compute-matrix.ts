#!/usr/bin/env -S pkgx deno^2 run --quiet --allow-env=GITHUB_OUTPUT

import { parse } from "brewkit";

const rvv: Record<string, any>[] = [];
for (const arg of Deno.args) {
  const pkg = parse(arg);
  const config = await get_config(pkg);

  for (const platform of config.platforms) {
    const rv = {} as Record<string, any>;
    rv["platform"] = get_matrix(platform);
    rv["pkg"] = arg;
    rvv.push(rv);
  }
}

const json = JSON.stringify(rvv);
console.log(json);

///////////////////////////////////////////////////////////////////////

//TODO should be in libpkgx!
async function get_config(pkg: { project: string }) {
  return { platforms: ["linux/x86-64", "darwin/aarch64"] };
}

function get_matrix(platform: string) {
  const name = platform.replace("/", "+");
  switch (platform) {
    case "darwin/aarch64": {
      //const os = ["self-hosted", "macOS", "ARM64"]
      const os = "macos-latest";
      return {
        os,
        name,
        tinyname: "²",
      };
    }
    case "darwin/x86-64": {
      const os = ["self-hosted", "macOS", "X64"];
      return {
        os,
        name,
        tinyname: "x64",
      };
    }
    case "linux/x86-64": {
      // const os = {group: "linux-x86-64"}
      const os = "ubuntu-latest";
      return {
        os,
        name,
        container: "ghcr.io/pkgxdev/bldbot",
        tinyname: "*nix64",
      };
    }
    case "linux/aarch64": {
      const os = ["self-hosted", "linux", "ARM64"];
      return {
        os,
        name,
        tinyname: "*nix·ARM64",
      };
    }
  }
}
