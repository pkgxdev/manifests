import { env_include, Path, run } from "brewkit";
import { assertPath } from "https://jsr.io/@std/path/1.0.8/_common/assert_path.ts";

export default async function () {
  env_include("ninja");
  Path.cwd().join("build").mkdir().cd();

  run`meson ..`;

  assertPath(Path.cwd().join("build.ninja").string);
}