import { run } from "brewkit";

export default async function () {
  // fixture: 'Hello, World!'
// script: |
//   brotli $FIXTURE $FIXTURE.br
//   brotli $FIXTURE.br --output=out.txt --decompress
//   test "$(cat $FIXTURE)" = "$(cat out.txt)"
// 
}