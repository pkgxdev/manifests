export default function () {
  // tools like `ldd` fail since they are installed to the system
  // and require the system glibc but we set LD_LIBRARY_PATH so that the
  // output from `ldd` is correct.
  // can be fixed if we use our own completely controlled docker image
  // all the same, no fixups are probably required since this _is_ *libc*
  return false;
}