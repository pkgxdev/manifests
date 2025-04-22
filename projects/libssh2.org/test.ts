import { run, undent } from "brewkit";

export default function() {
  Deno.writeTextFileSync('./test.c', undent`
    #include <libssh2.h>
    int main(void) {
      libssh2_exit();
      return 0;
    }`);

  run`cc test.c -lssh2`;
  run`./a.out`;
}
