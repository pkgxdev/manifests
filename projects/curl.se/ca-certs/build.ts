import { BuildOptions } from "brewkit";

export default async function build({ prefix, tag }: BuildOptions) {
  const rsp = await fetch(`https://curl.se/ca/${tag}.pem`);
  const dir = prefix.join("share/ssl").mkdir("p");
  using out = await Deno.open(dir.join("cert.pem").string, {
    create: true,
    write: true,
  });
  await rsp.body!.pipeTo(out.writable);
}
