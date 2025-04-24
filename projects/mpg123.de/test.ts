import { fixture, run } from "brewkit";

export default async function () {
  run`mpg123 --test ${fixture('mp3')}`;
}