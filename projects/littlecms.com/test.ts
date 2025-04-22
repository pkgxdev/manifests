import { fixture, run } from "brewkit";

export default async function () {
  run`jpgicc -iscanner.icc ${fixture('jpeg')} out.jpg`;
}
