#include <nghttp2/nghttp2.h>
#include <stdio.h>
int main() {
  nghttp2_info *info = nghttp2_version(0);
  printf("%s", info->version_str);
  return 0;
}