import { run } from "brewkit";

export default async function () {
  // dependencies:
//   freedesktop.org/pkg-config: ^0.29
// script:
//   - unset LIBRARY_PATH
//   - unset CPATH
//   - LD_LIBRARY_PATH_BAK=$LD_LIBRARY_PATH
//   - unset LD_LIBRARY_PATH
//   - DYLD_FALLBACK_LIBRARY_PATH_BAK=$DYLD_FALLBACK_LIBRARY_PATH
//   - unset DYLD_FALLBACK_LIBRARY_PATH
//   - cc $CFLAGS $LDFLAGS test.c
//   - export LD_LIBRARY_PATH=$LD_LIBRARY_PATH_BAK
//   - export DYLD_FALLBACK_LIBRARY_PATH=$DYLD_FALLBACK_LIBRARY_PATH_BAK
//   - ./a.out
//   - glib-mkenums --help
// env:
//   LDFLAGS: $(pkg-config --libs glib-2.0)
//   CFLAGS: $(pkg-config --cflags glib-2.0)
// 
}