import { run, TestOptions } from "brewkit";

export default async function ({ prefix }: TestOptions) {
  //TODO we need to add the deps to CMAKE_PREFIX_PATH too and that's complex and artificial

  // pkgx sets this but only when cmake is in the env, which here it is not
  // Deno.env.set("CMAKE_PREFIX_PATH", prefix.string);

  // run`pkgx cmake -B bld`;
  // run`pkgx cmake --build bld`;
  // run`./bld/myapp`;
}