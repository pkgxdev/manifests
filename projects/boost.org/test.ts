import { run } from "brewkit";

export default async function () {
  run`c++ test.cpp -std=c++14 -lboost_iostreams -lzstd`;
  run`./a.out`;
}