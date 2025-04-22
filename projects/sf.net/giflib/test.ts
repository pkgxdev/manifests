import { fixture, run } from "brewkit";

export default async function () {
  run`giftext ${fixture("gif")}`;
}