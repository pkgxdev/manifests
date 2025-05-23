#include <stdio.h>
#include <assert.h>
#include "vorbis/vorbisfile.h"
int main (void) {
  OggVorbis_File vf;
  assert (ov_open_callbacks (stdin, &vf, NULL, 0, OV_CALLBACKS_NOCLOSE) >= 0);
  vorbis_info *vi = ov_info (&vf, -1);
  printf("Bitstream is %d channel, %ldHz\\n", vi->channels, vi->rate);
  printf("Encoded by: %s\\n", ov_comment(&vf,-1)->vendor);
  return 0;
}