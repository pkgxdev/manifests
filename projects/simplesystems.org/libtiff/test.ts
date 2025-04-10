import { run, fixture } from "brewkit";

export default async function () {
  const tiff = fixture('tiff');
  run`cc test.c -ltiff`;
  run`./a.out ${tiff}`;
  run`tiffdump ${tiff}`;
}
