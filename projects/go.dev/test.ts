import { backticks, run } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function() {
  assertEquals(await backticks`go run test.go`, "Hello World");

  run`go build -o test test.go`;
  assertEquals(await backticks`./test`, "Hello World");
}
