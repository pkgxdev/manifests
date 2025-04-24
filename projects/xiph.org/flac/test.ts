import { backticks, fixture, run, TestOptions } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function ({ version }: TestOptions) {
  const out = await backticks`flac --version`;
  assertEquals(out, `flac ${version}`);
  const got = fixture('flac');
  run`flac
        --decode
        --force-raw
        --endian=little
        --sign=signed
        --output-name=out.raw
        ${got}`;
  run`flac
        --endian=little
        --sign=signed
        --channels=1
        --bps=8
        --sample-rate=8000
        --output-name=out.flac
        ./out.raw`;
}