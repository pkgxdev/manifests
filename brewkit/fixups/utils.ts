import { Path } from "brewkit";

export async function mime(path: Path | string) {
  using file = await Deno.open(path instanceof Path ? path.string : path);
  const buff = new Uint8Array(4);
  await file.read(buff);

  const check = (...bytes: number[]) => {
    return bytes.every((byte, index) => buff[index] === byte);
  };

  // first is elf, second is macho
  if (check(0x7F, 0x45, 0x4C, 0x46) || check(0xCF, 0xFA, 0xED, 0xFE)) {
    return "exe";
  } else if (check(0x23, 0x21)) {
    return "shebang";
  }
}
