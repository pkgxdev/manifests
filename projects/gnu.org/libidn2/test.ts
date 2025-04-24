import { backticks } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function () {
  assertEquals(await backticks`idn2 räksmörgås.se`, "xn--rksmrgs-5wao1o.se");
  assertEquals(await backticks`idn2 blåbærgrød.no`, "xn--blbrgrd-fxak7p.no");
}