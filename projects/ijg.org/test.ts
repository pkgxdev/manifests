import { fixture, run } from "brewkit";

export default async function () {
  run`djpeg ${fixture('jpeg')}`;
}
