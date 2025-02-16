import { backticks, run, TestOptions } from "brewkit";
import { assertEquals } from "jsr:@std/assert@^1/equals";
import { assertMatch } from "jsr:@std/assert@^1/match";

export default async function ({ prefix }: TestOptions) {
  switch (Deno.build.os) {
    case "linux":
      //TODO prove we linked to the dylibs
      // assertMatch(
      //   await backticks`ldd ${prefix}/lib/libreadline.so`,
      //   /ncurses/,
      // );
      run`cc -lreadline -lncurses -ltinfo test.c`;
      break;
    case "darwin":
      assertMatch(
        await backticks`otool -L ${prefix}/lib/libreadline.dylib`,
        /ncurses/,
      );
      run`cc -lreadline -lncurses test.c`;
      break;
  }

  const proc = new Deno.Command("./a.out", { stdin: "piped", stdout: "piped" })
    .spawn();

  const writer = await proc.stdin.getWriter();
  writer.write(new TextEncoder().encode("Hello, World!\n"));
  writer.close();

  const out = new TextDecoder().decode((await proc.output()).stdout);
  assertEquals(
    out,
    `test> Hello, World!
Hello, World!\\n`,
  );
}
