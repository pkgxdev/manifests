import { assertEquals } from "jsr:@std/assert@^1";
import { run } from "brewkit";

export default async function () {
  run`cc test.c -lz`;

  const sample = "Hello, World!"; //TODO random

  const compress = new Deno.Command("./a.out", {
    stdin: "piped",
    stdout: "piped",
  }).spawn();
  const decompress = new Deno.Command("./a.out", {
    args: ["-d"],
    stdin: "piped",
    stdout: "piped",
  }).spawn();

  compress.stdout.pipeTo(decompress.stdin);

  const writer = await compress.stdin.getWriter();
  writer.write(new TextEncoder().encode(sample));
  writer.close();

  const output = new TextDecoder().decode((await decompress.output()).stdout);

  assertEquals(output, sample);
}
