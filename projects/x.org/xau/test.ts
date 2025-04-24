import { run } from "brewkit";
import env_include from "../../../brewkit/env-include.ts";

export default async function () {
  env_include("x.org/protocol");
  run`cc ./test.c`;
  run`./a.out`;
}
