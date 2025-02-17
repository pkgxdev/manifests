import { assert, assertEquals } from "jsr:@std/assert@^1";

export default async function () {
  Deno.writeTextFileSync("./sample", "hello\n");

  const proc = new Deno.Command("patch", { args: ["./sample"], stdin: "piped" }).spawn();
  const stdin = proc.stdin.getWriter();
  const data = `
1c1
< hello
---
> goodbye
`;
  await stdin.write(new TextEncoder().encode(data));
  await stdin.close();
  const { success } = await proc.status;

  assert(success);
  assertEquals(Deno.readTextFileSync("./sample"), "goodbye\n");
}
