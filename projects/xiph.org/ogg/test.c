#include <ogg/ogg.h>
#include <stdio.h>
int main (void) {
  ogg_sync_state oy;
  ogg_stream_state os;
  ogg_page og;
  ogg_packet op;
  char *buffer;
  int bytes;
  ogg_sync_init (&oy);
  buffer = ogg_sync_buffer (&oy, 4096);
  bytes = fread(buffer, 1, 4096, stdin);
  ogg_sync_wrote (&oy, bytes);
  if (ogg_sync_pageout (&oy, &og) != 1)
    return 1;
  ogg_stream_init (&os, ogg_page_serialno (&og));
  if (ogg_stream_pagein (&os, &og) < 0)
    return 1;
  if (ogg_stream_packetout (&os, &op) != 1)
    return 1;
  return 0;
}
