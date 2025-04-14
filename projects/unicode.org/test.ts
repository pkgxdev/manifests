import { run } from "brewkit";

export default async function () {
  // script: |
//   if test -f /usr/share/dict/words; then
//     gendict --uchars /usr/share/dict/words dict
//   else
//     gendict --uchars $FIXTURE dict
//   fi
// fixture: |
//   hello
//   world
// 
}