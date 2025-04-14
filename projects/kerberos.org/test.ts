import { run } from "brewkit";

export default async function () {
  run`krb5-config --version`;
  run`krb5-config --cflags`;
}
