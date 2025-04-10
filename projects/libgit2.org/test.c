#include <git2.h>
#include <assert.h>
int main(int argc, char *argv[]) {
  int options = git_libgit2_features();
  assert(options & GIT_FEATURE_SSH);
  return 0;
}
