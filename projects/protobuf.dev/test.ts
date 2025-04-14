import { run } from "brewkit";

export default async function () {
  run`protoc test.proto --cpp_out=.`;
}
