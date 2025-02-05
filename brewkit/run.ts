function run_f(args: string[]) {
  if (args.length == 1) {
    args = splitArgs(args[0].trim());
  }
  const cmd = args.shift()!;

  console.error("%c+", "color:yellow", cmd, ...args);

  const { success, code } = new Deno.Command(cmd, {
    args,
    stdout: "inherit",
    stderr: "inherit",
  }).outputSync();

  if (!success) {
    console.error(`%c${cmd} error`, "color:red", `(${code})`);
    Deno.exit(code);
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
    console.error(`%c${cmd} error`, "color:red", `(${code})`);
    Deno.exit(code);
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
    console.error(`%c${cmd} error`, "color:red", `(${code})`);
    Deno.exit(code);
  }

  return new TextDecoder().decode(stdout);
}

function splitArgs(input: string): string[] {
  const regex = /"([^"]*)"|'([^']*)'|(\S+)/g;
  const args: string[] = [];
  let match;

  // Remove comments
  input = input.replace(/#.*$/gm, "");

  while ((match = regex.exec(input)) !== null) {
    args.push(match[1] || match[2] || match[3]);
  }

  return args;
}
