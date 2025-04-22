import { run } from "brewkit";

export default async function () {
  run`c++ test.cc -lsnappy -std=c++11`;
  run`./a.out`;
}