import { backticks, run, TestOptions } from "brewkit";
import { assertEquals } from "jsr:@std/assert@^1/equals";

export default async function ({ prefix }: TestOptions) {
  run`curl -i pkgx.sh`;
  run`curl --proto =https --tlsv1.2 -sSf https://get-ghcup.haskell.org`;

  assertEquals(await backticks`curl-config --prefix`, prefix.string);
}
