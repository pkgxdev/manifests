import { Path, run } from "brewkit";

export default async function () {
  run`pkgx git clone https://github.com/google/highway --depth=1`

  Path.cwd().join("highway/hwy/examples").cd();

  const cxxflags = Deno.build.os === "linux"
    ? "-Wl,--allow-shlib-undefined"
    : '';

  run`c++ -std=c++11 -lhwy ./profiler_example.cc ${cxxflags}`;
  run`./a.out`;
}
