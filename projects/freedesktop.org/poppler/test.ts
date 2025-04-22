import { fixture, run } from "brewkit";

export default async function () {
  run`pdfinfo ${fixture('pdf')}`;
}
