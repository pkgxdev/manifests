import { run } from "brewkit";

export default async function () {
  // script: |
//   mv $FIXTURE $FIXTURE.c
//   cc $FIXTURE.c "-levent"
//   ./a.out
// fixture: |
//   #include <event2/event.h>
//   int main() {
//     struct event_base *base;
//     base = event_base_new();
//     event_base_free(base);
//     return 0;
//   }
// 
}