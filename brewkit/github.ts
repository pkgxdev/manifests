import { Range, semver } from "./mod.ts";

// we have to fetch all releases and all tags since the GitHub API doesn't
// support filtering by semver ranges and there is no sensible other way to
// order the responses.

async function get_headers() {
  const headers: Record<string, string> = {
    "Accept": "application/vnd.github.v3+json",
  };

  const { state } = await Deno.permissions.query({
    name: "env",
    variable: "GITHUB_TOKEN",
  });

  if (state == "granted" && Deno.env.get("GITHUB_TOKEN")) {
    headers["Authorization"] = `bearer ${Deno.env.get("GITHUB_TOKEN")}`;
  }

  return headers;
}

export async function releases(
  repo: string,
  constraint: Range,
): Promise<{ tag_name: string; name: string }[]> {
  const headers = await get_headers();

  if (constraint.toString() == "*") {
    const rsp: Response = await fetch(
      `https://api.github.com/repos/${repo}/releases/latest`,
      { headers },
    );
    if (rsp.status == 404) {
      // no releases
      return [];
    }
    if (!rsp.ok) {
      console.error("%cerror:", "color: red", "you might need to set GITHUB_TOKEN");
      Deno.exit(1);
    }
    return [await rsp.json()];
  }

  let url: string | undefined = `https://api.github.com/repos/${repo}/releases?per_page=100`;

  const rv = [];
  while (url) {
    const rsp: Response = await fetch(url, { headers });
    if (!rsp.ok) {
      console.error("%cerror:", "color: red", "you might need to set GITHUB_TOKEN");
      Deno.exit(1);
    }
    rv.push(...await rsp.json());
    url = rsp.headers.get("link")?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
  }
  return rv;
}

export async function tags(repo: string): Promise<{ name: string }[]> {
  let url: string | undefined = `https://api.github.com/repos/${repo}/tags?per_page=100`;
  const headers = await get_headers();

  const rv = [];
  while (url) {
    const rsp: Response = await fetch(url, { headers });
    if (!rsp.ok) {
      console.error("%cerror:", "color: red", "you might need to set GITHUB_TOKEN");
      Deno.exit(1);
    }
    rv.push(...await rsp.json());
    url = rsp.headers.get("link")?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
  }
  return rv;
}

export function std_version_covert(
  { tag_name, name }: { tag_name?: string; name: string },
) {
  const tag = tag_name || name; // depends on if we fetched /releases or /tags
  let parsable_tag = tag;
  if (/^[a-zA-Z]+-/.test(tag)) {
    // common to put the project name or something like it as the prefix
    parsable_tag = tag.replace(/^[a-zA-Z]+-/, "");
  }
  const version = semver.parse(parsable_tag);
  if (version) {
    return { version, tag };
  }
}
