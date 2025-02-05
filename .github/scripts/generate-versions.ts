#!/usr/bin/env -S pkgx deno run --quiet --allow-net --allow-read --allow-env --allow-sys
import { ListObjectsV2Command, S3Client } from "npm:@aws-sdk/client-s3@3.743.0";
import SemVer, { compare } from "https://deno.land/x/libpkgx@v0.20.3/src/utils/semver.ts";
import { basename } from "jsr:@std/path@^1.0.8";

const s3 = new S3Client();
const Bucket = "dist.tea.xyz";
const Prefix = Deno.args[0];
const Key = `${Prefix}/versions.txt`;

async function listObjects() {
  const cmd = new ListObjectsV2Command({ Bucket, Prefix });
  const rsp = await s3.send(cmd);

  if (!rsp.Contents || rsp.Contents.length === 0) {
    return [];
  }

  const rv = new Set<string>();
  for (const obj of rsp.Contents) {
    const base = basename(obj!.Key);
    if (/^v\d+/.test(base)) {
      rv.add(base.replace(/\.tar\.[gx]z$/, ""));
    }
  }
  return [...rv];
}

const versions = (await listObjects()).map((x) => new SemVer(x)).sort(compare)
  .join("\n");

console.log(versions);

//TODO upload, I tried but Deno and the AWS SDK don’t mix. Maybe bun’ll work?
