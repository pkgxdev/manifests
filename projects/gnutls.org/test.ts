export default async function () {
  const proc = new Deno.Command("gnutls-cli", {args: ["pkgx.dev"], stdin: "piped" }).spawn();
  const stdin = proc.stdin.getWriter();
  await stdin.write(new TextEncoder().encode("GET /\n"));
  stdin.close();
  const { success } = await proc.status;
  if (!success) {
    throw new Error("gnutls-cli failed");
  }
}
