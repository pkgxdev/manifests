import { basename as std_basename } from "jsr:@std/path@^1";
import Path from "../path.ts";

export default async function (path: Path, provided_programs: string[]) {
  //FIXME this could be pretty damn efficient if we can find the time
  //NOTE as it stands this is HIDEOUSLY inefficient

  const contents = await Deno.readFile(path.string);
  const txt = new TextDecoder().decode(contents);
  const [line0, ...lines] = txt.trimStart().split("\n"); //lol

  const match = line0.match(/^#!(\s*)(\/[^\s]+)/);
  if (!match) {
    console.error(`::error file=${path}::could not parse shebang`);
    return;
  }
  let interpreter = match[2];

  switch (interpreter) {
    case "/bin/bash":
    case "/bin/zsh":
    case "/bin/sh":
      if (match[1]) {
        // fix leading spaces in shebang
        break;
      } else {
        return;
      }
    case "/usr/bin/env":
      interpreter = (line0.match(/env\s+(.*)/)?.[1] ?? "").split(/\s+/)[0];
      if (interpreter == "-S" || !interpreter) {
        console.error(`::error file=${path}::${line0.trim()}`);
        return;
      }
      break;
  }

  const basename = std_basename(interpreter);

  const shebang = (() => {
    if (provided_programs.includes(basename)) {
      return `#!/usr/bin/env ${basename}`;
    }

    switch (basename) {
      case "sh":
      case "bash":
      case "zsh":
        return `#!/bin/${basename}`;
    }

    const match = basename.match(/python(\d(\.\d+)?)/);
    if (match?.[1]) {
      return `#!/usr/bin/env -S pkgx python~${match[1]}`;
    }

    if (Deno.build.os == "darwin") {
      switch (basename) {
        case "perl":
        case "ruby":
          // these are part of the macOS system ∴ use them
          return `#!/usr/bin/${basename}`;
      }
    }

    return `#!/usr/bin/env -S pkgx ${basename}`;
  })();

  if (!shebang) return;

  const rewrite = `${shebang}\n${lines.join("\n")}`;

  console.error(
    "%c+",
    "color:yellow",
    "rewriting shebang:",
    path,
    "from",
    line0,
    "to",
    shebang,
  );

  const stat = Deno.lstatSync(path.string);
  const needs_chmod = stat.mode && !(stat.mode & 0o200);
  if (needs_chmod) Deno.chmodSync(path.string, 0o666);
  await Deno.writeFile(path.string, new TextEncoder().encode(rewrite));
  if (needs_chmod) Deno.chmodSync(path.string, stat.mode!);
}
