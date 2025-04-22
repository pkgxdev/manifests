import { run } from "brewkit";

export default async function () {
  using f = await Deno.open("./test.exr", { create: true, write: true });
  const rsp = await fetch("https://github.com/AcademySoftwareFoundation/openexr-images/raw/main/TestImages/AllHalfValues.exr")
  await rsp.body!.pipeTo(f.writable);

  run`exrheader ./test.exr`;
}