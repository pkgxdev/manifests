#include <nettle/sha1.h>
#include <stdio.h>
int main()
{
  struct sha1_ctx ctx;
  uint8_t digest[SHA1_DIGEST_SIZE];
  unsigned i;
  sha1_init(&ctx);
  sha1_update(&ctx, 4, "test");
  sha1_digest(&ctx, SHA1_DIGEST_SIZE, digest);
  printf("SHA1(test)=");
  for (i = 0; i<SHA1_DIGEST_SIZE; i++)
    printf("%02x", digest[i]);
  printf("\\n");
  return 0;
}