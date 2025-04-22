import { env_include, run } from "brewkit";

export default async function () {
  env_include("x.org/protocol");
  run`cc test.c`;
  run`./a.out`;
}