import { backticks } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function () {
  assertEquals(
    await backticks`gpg-error 56`,
    "56 = (0, 56) = (GPG_ERR_SOURCE_UNKNOWN, GPG_ERR_BAD_CERT_CHAIN) = (Unspecified source, Bad certificate chain)"
  );
}
