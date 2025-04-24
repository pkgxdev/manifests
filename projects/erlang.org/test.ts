import { backticks, run } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function () {
  try {
    run`epmd -kill`;
  } catch {
    //noop
  }
  run`epmd -daemon -address 127.0.0.1 -relaxed_command_check`;
  const out = await backticks`escript ./test.erl 10`;
  assertEquals(out, "factorial 10 = 3628800");
  run`epmd -kill`;
}