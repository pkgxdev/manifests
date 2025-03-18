#include <mpc.h>
#include <assert.h>
#include <math.h>

int main() {
  mpc_t x;
  mpc_init2 (x, 256);
  mpc_set_d_d (x, 1., INFINITY, MPC_RNDNN);
  mpc_tanh (x, x, MPC_RNDNN);
  assert (mpfr_nan_p (mpc_realref (x)) && mpfr_nan_p (mpc_imagref (x)));
  mpc_clear (x);
  return 0;
}
