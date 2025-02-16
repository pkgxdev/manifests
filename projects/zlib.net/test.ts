import { assertEquals } from "jsr:@std/assert@^1";
import { run } from "brewkit";

export default async function () {
  if (Deno.build.os !== "windows") {
    run`cc test.c -lz -o test`;
  } else {
    run`cl test.c zlib.lib`;
  }

  const sample = "Hello, World!"; //TODO random

  const compress = new Deno.Command("./test", {
    stdin: "piped",
    stdout: "piped",
  }).spawn();
  const decompress = new Deno.Command("./test", {
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
