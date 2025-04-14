import { run } from "brewkit";

export default async function () {
  // - run: cp $FIXTURE test.proto
//   fixture:
//     extname: proto
//     content: |
//       syntax = "proto3";
//       package test;
//       message TestCase {
//         string name = 4;
//       }
//       message Test {
//         repeated TestCase case = 1;
//       }
// - protoc test.proto --cpp_out=.
// 
}