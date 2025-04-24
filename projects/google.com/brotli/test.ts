import { run } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function () {
  Deno.writeTextFileSync('./test.txt', 'Hello, World!');
  run`brotli ./test.txt ./test.txt.br`;
  run`brotli ./test.txt.br --output=out.txt --decompress`;
  assertEquals(
    Deno.readTextFileSync('./test.txt'),
    Deno.readTextFileSync('./out.txt'),
  );
}