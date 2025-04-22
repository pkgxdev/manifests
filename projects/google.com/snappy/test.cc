#include <assert.h>
#include <snappy.h>
#include <string>
using namespace std;
using namespace snappy;
int main() {
  string source = "Hello World!";
  string compressed, decompressed;
  Compress(source.data(), source.size(), &compressed);
  Uncompress(compressed.data(), compressed.size(), &decompressed);
  assert(source == decompressed);
  return 0;
}