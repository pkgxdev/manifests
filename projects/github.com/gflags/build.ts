import { BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/gflags/gflags/archive/refs/tags/${tag}.tar.gz`);

  run`cmake
        -B bld
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DBUILD_SHARED_LIBS=ON
        -DBUILD_STATIC_LIBS=ON
        -DCMAKE_POSITION_INDEPENDENT_CODE=ON
        -DCMAKE_POLICY_VERSION_MINIMUM=3.5  # †
        `;

  // Path.cwd().parent().join("pkgs/gnu.org/gcc/libstdcxx/v14/include").rm('rf');
  // new Path("/root/.pkgx/gnu.org").rm('rf');

  run`cmake --build bld --target install --config Release`;
}

/* †
CMake Error at CMakeLists.txt:73 (cmake_minimum_required):
-- Configuring incomplete, errors occurred!
  Compatibility with CMake < 3.5 has been removed from CMake.

  Update the VERSION argument <min> value.  Or, use the <min>...<max> syntax
  to tell CMake that the project requires at least <min> but has been updated
  to work with policies introduced by <max> or earlier.

  Or, add -DCMAKE_POLICY_VERSION_MINIMUM=3.5 to try configuring anyway.
 */