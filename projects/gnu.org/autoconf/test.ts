import { assert } from "jsr:@std/assert@1";
import { Path, run } from "brewkit";

export default function () {
  run`env`;
  run`autoconf --verbose --debug`;
  run`./configure`;
  assert(Path.cwd().join("config.status").isFile());
  assert(Path.cwd().join("config.log").isFile());
}
