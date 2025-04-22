#include <ft2build.h>
#include FT_FREETYPE_H
FT_Library  library;
int main() {
  return FT_Init_FreeType( &library );
}
