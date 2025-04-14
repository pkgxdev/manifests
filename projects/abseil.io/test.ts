import { run, backticks } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function () {
  const flags = await backticks`pkg-config --cflags --libs absl_strings`;
  run`c++ -std=c++17 test.cc ${flags}`;
  const out = await backticks`./a.out`;
  assertEquals(out, "Joined string: foo-bar-baz\n");
}