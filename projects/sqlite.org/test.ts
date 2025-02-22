import { run } from "brewkit";

export default async function () {
  run`sqlite3 --version`;
}
