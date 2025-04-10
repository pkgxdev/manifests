import { nonce, run } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function () {
  await test("zstd");
  await test("pzstd");
  await test("xz");
  await test("lz4");
  await test("gzip");
}

async function test(cmd: string) {
  console.error(`testing ${cmd}`);

  const sample = nonce();

  const compress = new Deno.Command(cmd, {
    stdin: "piped",
    stdout: "piped",
  }).spawn();
  const decompress = new Deno.Command("zstd", {
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
