import { nonce, run } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function () {
  run`flex test.flex`;
  run`cc lex.yy.c -lfl`;

  const sample = "Hello World";

  const proc = new Deno.Command("./a.out", {
    stdin: "piped",
    stdout: "piped",
  }).spawn();

  const writer = await proc.stdin.getWriter();
  writer.write(new TextEncoder().encode(sample));
  writer.close();

  const output = new TextDecoder().decode((await proc.output()).stdout);

  assertEquals(output, "Hello\nWorld");
}
