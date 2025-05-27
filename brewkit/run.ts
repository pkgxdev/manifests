function run_f(args: string[]) {
  if (args.length == 1) {
    args = splitArgs(args[0].trim());
  }
  const cmd = args.shift()!;

  const pretty_args = args.map((arg) => {
    if (arg.includes(" ")) {
      return arg.replaceAll(/\s+/g, "\\ ");
    } else {
      return arg;
    }
  });

  console.error("%c+", "color:yellow", cmd, ...pretty_args);

  const { success, code } = new Deno.Command(cmd, {
    args,
    stdout: "inherit",
    stderr: "inherit",
  }).outputSync();

  if (!success) {
    throw new Error(`${cmd}: (${code})`);
  }
}

export default function run(strings: TemplateStringsArray, ...values: any[]) {
  const s = String.raw(strings, ...values);
  return run_f([s]);
}

export async function backticks(
  strings: TemplateStringsArray,
  ...values: any[]
) {
  const cmdln = String.raw(strings, ...values);
  const [cmd, ...args] = splitArgs(cmdln.trim());

  console.error("%c+", "color:yellow", cmd, ...args);

  const proc = new Deno.Command(cmd, { args, stdout: "piped" }).spawn();

  let rv = "";
  const decoder = new TextDecoder();
  for await (const chunk of proc.stdout) {
    const decoded_chunk = decoder.decode(chunk);
    console.log(decoded_chunk);
    rv += decoded_chunk;
  }

  const { success, code } = await proc.status;

  if (!success) {
    throw new Error(`${cmd}: (${code})`);
  }

  return rv.trimEnd();
}

export function backticks_quiet(
  strings: TemplateStringsArray,
  ...values: any[]
) {
  const cmdln = String.raw(strings, ...values);
  const [cmd, ...args] = cmdln.trim().split(/\s+/);

  const { success, stdout, code } = new Deno.Command(cmd, {
    args,
    stdout: "piped",
    stderr: "inherit",
  }).outputSync();

  if (!success) {
    throw new Error(`${cmd}: (${code})`);
  }

  return new TextDecoder().decode(stdout).trimEnd();
}

function splitArgs(input: string): string[] {
  // Remove comments
  input = input.replace(/#.*$/gm, "").trim();

  const args: string[] = [];
  const regex = /(?:[^\s"'=]+=(?:"[^"]*"|'[^']*'|[^\s]+)|"[^"]*"|'[^']*'|[^\s]+)/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
    let token = match[0];

    // Strip outer quotes around right-hand side of `key=val`
    if (token.includes("=")) {
      const [key, val] = token.split(/=(.+)/, 2);
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        args.push(`${key}=${val.slice(1, -1)}`);
      } else {
        args.push(token);
      }
    } else {
      // Strip quotes for standalone quoted values
      if (
        (token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'"))
      ) {
        token = token.slice(1, -1);
      }
      args.push(token);
    }
  }

  return args;
}
