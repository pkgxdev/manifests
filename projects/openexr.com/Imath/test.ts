import { run } from "brewkit";

export default async function () {
// script:
//   - run: >
//       if ! test -f
//       /Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include/AvailabilityInternalLegacy.h;
//       then
//         echo "Missing SDK; skipping remaining tests"
//         exit 0
//       fi
//     if: darwin
  run`c++ -std=c++11 -lImath test.cc`;
  run`./a.out`;
}
