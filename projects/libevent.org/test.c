#include <event2/event.h>
int main() {
  struct event_base *base;
  base = event_base_new();
  event_base_free(base);
  return 0;
}