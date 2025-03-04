#!/usr/bin/env node

const fs = require("fs");

(async function () {
  const rvv = [];
  for (const arg of process.argv.slice(2)) {
    const config = await get_config();

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

async function get_config() {
  return { platforms: ["linux/x86-64", "darwin/aarch64", "windows/x86-64"] };
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
