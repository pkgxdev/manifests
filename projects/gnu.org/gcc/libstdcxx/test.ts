import { run, TestOptions } from "brewkit";

export default function() {
  run`c++ test.cc -std=c++20 -lstdc++`;
  run`./a.out`;
}
