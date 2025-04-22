import { run } from "brewkit";

export default async function () {
  // script: |
//   mv $FIXTURE test.c
//   cc test.c
//   ./a.out
// fixture: |
//   #include "X11/Xauth.h"
//   int main(int argc, char* argv[]) {
//     Xauth auth;
//     return 0;
//   }
// 
}