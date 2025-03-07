import { run } from "brewkit";

export default function () {
  Deno.writeTextFileSync("fixture.txt", "test");
  run`libdeflate-gzip ./fixture.txt`;
  run`libdeflate-gunzip -d ./fixture.txt.gz`;
}
