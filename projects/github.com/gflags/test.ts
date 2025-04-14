import { run } from "brewkit";

export default async function () {
  run`c++ test.cc -lgflags`;
  run`./a.out`;
}