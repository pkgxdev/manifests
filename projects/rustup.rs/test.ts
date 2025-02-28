import { run, undent } from "brewkit";

export default function () {
  Deno.writeTextFileSync(
    "test.rs",
    undent`
    fn main() {
      println!("Hello World!");
    }`,
  );
  run`rustc test.rs -o hello --crate-name hello`;
  run`./hello`;
}
