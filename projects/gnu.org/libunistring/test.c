#include <uniname.h>
#include <unistdio.h>
#include <unistr.h>
#include <stdlib.h>
int main (void) {
  uint32_t s[2] = {};
  uint8_t buff[12] = {};
  if (u32_uctomb (s, unicode_name_character ("TEAPOT"), sizeof s) != 1) abort();
  if (u8_sprintf (buff, "%llU", s) != 4) abort();
  printf ("%s\\n", buff);
  return 0;
}