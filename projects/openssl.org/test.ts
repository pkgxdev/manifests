import { assertEquals } from "jsr:@std/assert@^1";
import { run, TestOptions } from "brewkit";

export default async function ({ prefix, version }: TestOptions) {
  Deno.writeTextFileSync("./in", "This is a test file\n");

  run`openssl dgst -sha256 -out out ./in`;

  if (version.major >= 3) {
    assertEquals(
      Deno.readTextFileSync("out").trim(),
      "SHA2-256(./in)= c87e2ca771bab6024c269b933389d2a92d4941c848c52f155b9b84e1f109fe35",
    );
  } else {
    assertEquals(
      Deno.readTextFileSync("out").trim(),
      "SHA256(./in)= c87e2ca771bab6024c269b933389d2a92d4941c848c52f155b9b84e1f109fe35",
    );
  }

  // test we find and use curl.se/ca-certs
  run`openssl s_client -connect example.com:443 -verify_return_error`;
}
