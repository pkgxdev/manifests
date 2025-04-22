#include <ImathRoots.h>
#include <algorithm>
#include <iostream>
int main(int argc, char *argv[])
{
  double x[2] = {0.0, 0.0};
  int n = IMATH_NAMESPACE::solveQuadratic(1.0, 3.0, 2.0, x);
  if (x[0] > x[1])
    std::swap(x[0], x[1]);
  std::cout << n << ", " << x[0] << ", " << x[1] << "\n";
}