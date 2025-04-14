import { run } from "brewkit";

export default async function () {
  // dependencies:
//   cmake.org: '*'
//   linux:
//     gnu.org/make: '*'
//     llvm.org: '*'
// script:
//   - run: cat $FIXTURE >main.cpp
//     fixture: |
//       #include <glog/logging.h>
//       #include <iostream>
//       #include <memory>
//       int main(int argc, char* argv[])
//       {
//         google::InitGoogleLogging(argv[0]);
//         LOG(INFO) << "test";
//       }
//   - run: cat $FIXTURE >CMakeLists.txt
//     fixture: |
//       cmake_minimum_required (VERSION 3.16)
//       project (myproj VERSION 1.0)
//       find_package (glog 0.6.0 REQUIRED)
//       add_executable (myapp main.cpp)
//       target_link_libraries (myapp glog::glog)
//   - cmake -S . -B build
//   - cmake --build build
//   - ./build/myapp
// 
}