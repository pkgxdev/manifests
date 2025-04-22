import { Path, run } from "brewkit";

export default async function () {
  if (new Path("/usr/share/dict/words").isFile()) {
    run`gendict --uchars /usr/share/dict/words dict`;
  } else {
    Deno.writeTextFileSync("./fixture", "hello\nworld");
    run`gendict --uchars ./fixture dict`;
  }
}
