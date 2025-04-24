#include <stdio.h>
#include <apr-1/apr_version.h>
int main() {
  printf("%s", apr_version_string());
  return 0;
}