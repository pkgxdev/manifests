import Path from "./path.ts";

export default async function (path: Path) {
  const has_shebang = (() => {
    const encoder = new TextDecoder();
    return (buf: Uint8Array) => {
      return encoder.decode(buf) == "#!";
    };
  })();

  using rid = await Deno.open(path.string, { read: true });
  const buf = new Uint8Array(2);
  await rid.read(buf);
  if (!has_shebang(buf)) return;

  //FIXME this could be pretty damn efficient if we can find the time
  //NOTE as it stands this is HIDEOUSLY inefficient

  const contents = await Deno.readFile(path.string);
  const txt = new TextDecoder().decode(contents);
  const [line0, ...lines] = txt.trimStart().split("\n"); //lol

  const match = line0.match(/^#!\s*(\/[^\s]+)/);
  if (!match) throw new Error(`shebang not found in ${path}`);
  const interpreter = match[1];

  switch (interpreter) {
    case "/usr/bin/env":
    case "/bin/sh":
      return;
    case "/usr/bin/perl":
    case "/usr/bin/python3":
    case "/usr/bin/ruby":
    case "/usr/bin/env perl":
    case "/usr/bin/env python3":
    case "/usr/bin/env ruby":
      if (Deno.build.os == "darwin") {
        // on macOS these are provided, so use them
        return;
      }
  }

  const shebang = `#!/usr/bin/env -S pkgx ${new Path(interpreter).basename()}`;

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
    `#!/usr/bin/env ${interpreter}`,
  );
}
