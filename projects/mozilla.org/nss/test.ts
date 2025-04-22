import { backticks, run } from "brewkit";
import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";

export default async function () {
  run`certutil -N -d ./ -f ./test.txt`;
  const out = await backticks`certutil -L -d ./`;
  assertStringIncludes(out, "Certificate Nickname");
}
