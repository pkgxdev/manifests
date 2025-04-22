#include <assert.h>
#include <sodium.h>
int main() {
  assert(sodium_init() != -1);
  return 0;
}
