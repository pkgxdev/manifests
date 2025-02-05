import { basename as std_basename } from "jsr:@std/path@^1";
import Path from "./path.ts";

export default async function (path: Path, provided_programs: string[]) {
  //FIXME this could be pretty damn efficient if we can find the time
  //NOTE as it stands this is HIDEOUSLY inefficient

  const contents = await Deno.readFile(path.string);
  const txt = new TextDecoder().decode(contents);
  const [line0, ...lines] = txt.trimStart().split("\n"); //lol

  const match = line0.match(/^#!\s*(\/[^\s]+)/);
  if (!match) {
    console.error("%c!", "color:red", "shebang cannot be parsed:", path);
    return;
  }
  let interpreter = match[1];

  switch (interpreter) {
    case "/bin/bash":
    case "/bin/zsh":
    case "/bin/sh":
      contents;
      return;
    case "/usr/bin/env":
      interpreter = (line0.match(/env\s+(.*)/)?.[1] ?? "").split(/\s+/)[0];
      if (interpreter == "-S") {
        throw new Error(`shebang is a \`env -S\` jobbie ${path}`);
      }
      if (!interpreter) throw new Error(`shebang could not be parsed ${path}`);
      break;
  }

  const basename = std_basename(interpreter);

  if (Deno.build.os == "darwin") {
    switch (basename) {
      case "perl":
      case "python3":
      case "ruby":
        // these are part of the macOS system ∴ use them
        return;
    }
  }

  const shebang = provided_programs.includes(basename)
    ? `#!/usr/bin/env ${basename}`
    : `#!/usr/bin/env -S pkgx ${basename}`;

  const rewrite = `${shebang}\n${lines.join("\n")}`;

  const stat = Deno.lstatSync(path.string);
  const needs_chmod = stat.mode && !(stat.mode & 0o200);
  if (needs_chmod) Deno.chmodSync(path.string, 0o666);
  await Deno.writeFile(path.string, new TextEncoder().encode(rewrite));
  if (needs_chmod) Deno.chmodSync(path.string, stat.mode!);

  console.error(
    "%c+",
    "color:red",
    "rewrote:",
    path,
    "to:",
    shebang,
  );
}
