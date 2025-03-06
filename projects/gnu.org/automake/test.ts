import { ensure, run } from "brewkit";

//TODO to prove automake doesn't require autoconf we should use “depend” on
// the autoconf test to generate our `configure` separately
export default function () {
  ensure("make");

  run`aclocal`;
  run`autoconf`;
  run`automake --add-missing --foreign`;
  run`./configure`;
  run`make`;
  run`./test`;
}
