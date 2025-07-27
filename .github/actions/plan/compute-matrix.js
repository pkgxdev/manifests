#!/usr/bin/env node

const fs = require("fs");
const { parse } = require("yaml");
const path = require("path");

(async function () {
  let pkgs = [];
  let platforms = process.argv.indexOf("--platforms");
  if (platforms != -1) {
    pkgs = process.argv.slice(2, platforms);
    if (process.argv[platforms + 1]) {
      platforms = [];
      for (const platform of process.argv.slice(platforms + 1)) {
        switch (platform) {
          case "linux":
            platforms.push("linux/x86-64");
            break;
          case "darwin":
            platforms.push("darwin/aarch64");
            break;
          case "windows":
            platforms.push("windows/x86-64");
            break;
          default:
            platforms.push(platform);
            break;
        }
      }
    } else {
      platforms = null;
    }
  } else {
    platforms = null;
    pkgs = process.argv.slice(2);
  }

  const rvv = [];
  for (const arg of pkgs) {
    const config = await get_config(arg);

    if (platforms) {
      config.platforms = config.platforms.filter((platform) => platforms.includes(platform));
    }

    for (const platform of config.platforms) {
      const rv = {};
      rv["platform"] = get_matrix(platform);
      rv["pkg"] = arg;
      rvv.push(rv);
    }
  }

  const json = JSON.stringify(rvv);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `matrix=${json}\n`);
})();

///////////////////////////////////////////////////////////////////////

async function get_config(pkgspec) {
  return { platforms: ["darwin/aarch64"] };

  const project = pkgspec.split(/[*^~=@]/)[0];
  const file = path.join(
    path.dirname(path.dirname(path.dirname(path.dirname(__filename)))),
    "projects",
    project,
    "package.yml",
  );
  const data = fs.readFileSync(file, "utf8");
  const yaml = parse(data) || {};

  if (yaml.platforms === "*") {
    return { platforms: ["linux/x86-64", "darwin/aarch64", "windows/x86-64"] };
  } else if (Array.isArray(yaml.platforms)) {
    return { platforms: yaml.platforms };
  } else {
    return { platforms: [] };
  }
}

function get_matrix(platform) {
  const name = platform.replace("/", "+");
  switch (platform) {
    case "darwin/aarch64":
      return {
        os: "macos-latest",
        name,
        tinyname: "²",
      };
    case "darwin/x86-64":
      return {
        os: ["self-hosted", "macOS", "X64"],
        name,
        tinyname: "x64",
      };
    case "linux/x86-64":
      return {
        os: "ubuntu-latest",
        name,
        container: "ghcr.io/pkgxdev/bldbot",
        tinyname: "*nix64",
      };
    case "linux/aarch64":
      return {
        os: ["self-hosted", "linux", "ARM64"],
        name,
        tinyname: "*nix·ARM64",
      };
    case "windows/x86-64":
      return {
        os: "windows-latest",
        name,
        tinyname: "win64",
      };
  }
}
