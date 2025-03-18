import { run } from "brewkit";

export default function () {
  // representitive output to look for
  const TEST_STRING = Deno.build.os == "darwin" ? "_opendir" : "GNU_HASH";
  run`objdump -x $(which objdump) | grep -s ${TEST_STRING}`;
}
