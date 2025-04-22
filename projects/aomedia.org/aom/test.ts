import { run } from "brewkit";

export default async function () {
  run`aomenc --help`;
  run`aomdec --help`;
}
