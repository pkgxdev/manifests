import { env_include, run } from "brewkit";

export default async function () {
  if (Deno.build.os == 'linux') {
    env_include("gnu.org/gcc");
  }
  run`c++ -std=c++11 test.cc -liconv`;
  run`./a.out`;
}
