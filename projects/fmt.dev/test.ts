import { assertEquals } from "jsr:@std/assert@1/equals";
import { run, backticks_quiet } from "brewkit";

export default async function () {
  run`c++ test.cc -lfmt -std=c++11`
  assertEquals(backticks_quiet`./a.out`, "The answer is 42");
}
