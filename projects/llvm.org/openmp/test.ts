import { run } from "brewkit";

export default async function () {
  run`c++ -Werror -Xpreprocessor -fopenmp ./test.cpp -std=c++11 -lomp `;
  run`./a.out`;
}
