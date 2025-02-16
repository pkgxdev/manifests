import { assertEquals } from "jsr:@std/assert@^1";
import { Path, run } from "brewkit";

function nonce(length = 32): string {
  const base62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((n) => base62[n % 62]) // Map random bytes to Base62 characters
    .join("");
}

export default async function () {
  const sample = nonce();

  const compress = new Deno.Command("bzip2", {
    stdin: "piped",
    stdout: "piped",
  }).spawn();
  const decompress = new Deno.Command("bunzip2", {
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

  const f = Path.cwd().join("file").write(`hi\n${sample}\nhi`);
  run`bzip2 ${f}`;
  run`bzegrep ${sample} ./file.bz2`;
}
