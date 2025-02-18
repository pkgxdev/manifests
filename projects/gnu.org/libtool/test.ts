import { assert } from "jsr:@std/assert@^1";
import { Path, run } from "brewkit";

export default async function () {
  run`libtoolize`;
  assert(Path.cwd().join("ltmain.sh").exists());
}
