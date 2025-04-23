import { run } from "brewkit";

export default async function () {
  run`c++ test.cpp -lass`;
  run`./a.out`;
}
