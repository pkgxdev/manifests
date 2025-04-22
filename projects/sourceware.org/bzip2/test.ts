import { assertEquals } from "jsr:@std/assert@^1";
import { Path, run, nonce } from "brewkit";

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

  if (Deno.build.os != "windows") {
    // windows doesn’t built bzegrep and has no symlinks so I”m not sure how we’re meant to get it
    const f = Path.cwd().join("file").write(`hi\n${sample}\nhi`);
    run`bzip2 ${f}`;
    run`bzegrep ${sample} ./file.bz2`;
  }
}
