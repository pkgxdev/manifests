#include <openjpeg.h>
int main () {
  opj_image_cmptparm_t cmptparm;
  const OPJ_COLOR_SPACE color_space = OPJ_CLRSPC_GRAY;
  opj_image_t *image;
  image = opj_image_create(1, &cmptparm, color_space);
  opj_image_destroy(image);
  return 0;
}
