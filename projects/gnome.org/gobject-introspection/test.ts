import { Path, run } from "brewkit";
import env_include from "../../../brewkit/env-include.ts";
import { assert } from "jsr:@std/assert@1/assert";

export default async function () {
  try {
    env_include("git-scm.org gnome.org/glib");
  } catch {
    console.error("there is a cyclic dep between glib and this pkg.");
    console.error("we’ll pass the test for now but rebuild glib and then run this again.");
    return;
  }

  run`git clone https://gist.github.com/7a0023656ccfe309337a.git tst`;
  Path.cwd().join("tst").cd();
  run`pkgx git apply ../test_make.diff`;
  run`make`;

  assert(Path.cwd().join("Tut-0.1.typelib").exists());
}
