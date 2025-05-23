#include <opus.h>
int main(int argc, char **argv)
{
  int err = 0;
  opus_int32 rate = 48000;
  int channels = 2;
  int app = OPUS_APPLICATION_AUDIO;
  OpusEncoder *enc;
  int ret;
  enc = opus_encoder_create(rate, channels, app, &err);
  if (!(err < 0))
  {
    err = opus_encoder_ctl(enc, OPUS_SET_BITRATE(OPUS_AUTO));
    if (!(err < 0))
    {
        opus_encoder_destroy(enc);
        return 0;
    }
  }
  return err;
}