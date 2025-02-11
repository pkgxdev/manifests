import { BuildOptions } from "brewkit";

export default async function build({ prefix, tag }: BuildOptions) {
  const rsp = await fetch(`https://curl.se/ca/${tag}.pem`);
  const dir = prefix.join("share").mkdir("p");
  using out = await Deno.open(dir.join("ca-certs.pem").string, {
    create: true,
    write: true,
  });
  await rsp.body!.pipeTo(out.writable);
}
