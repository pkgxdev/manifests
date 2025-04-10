#include <tiffio.h>
int main(int argc, char* argv[]) {
  TIFF *out = TIFFOpen(argv[1], "w");
  TIFFSetField(out, TIFFTAG_IMAGEWIDTH, (uint32) 10);
  TIFFClose(out);
  return 0;
}
