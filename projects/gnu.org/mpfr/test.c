#include <mpfr.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

int main() {
  mpfr_t x, y;
  mpfr_inits2 (256, x, y, NULL);
  mpfr_set_ui (x, 2, MPFR_RNDN);
  mpfr_rootn_ui (y, x, 2, MPFR_RNDN);
  mpfr_pow_si (x, y, 4, MPFR_RNDN);
  mpfr_add_si (y, x, -4, MPFR_RNDN);
  mpfr_abs (y, y, MPFR_RNDN);
  if (fabs(mpfr_get_d (y, MPFR_RNDN)) > 1.e-30) abort();
  printf("%s", mpfr_get_version());
  return 0;
}
