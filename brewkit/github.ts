import { Range, SemVer } from "./mod.ts";

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
    return [await rsp.json()];
  }

  let url: string | undefined =
    `https://api.github.com/repos/${repo}/releases?per_page=100`;

  const rv = [];
  while (url) {
    const rsp: Response = await fetch(url, { headers });
    rv.push(...await rsp.json());
    url = rsp.headers.get("link")?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
  }
  return rv;
}

export async function tags(repo: string): Promise<{ name: string }[]> {
  let url: string | undefined =
    `https://api.github.com/repos/${repo}/tags?per_page=100`;
  const headers = await get_headers();

  const rv = [];
  while (url) {
    const rsp: Response = await fetch(url, { headers });
    rv.push(...await rsp.json());
    url = rsp.headers.get("link")?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
  }
  return rv;
}

export function std_version_covert(
  { tag_name, name }: { tag_name?: string; name: string },
) {
  const tag = tag_name || name; // depends on if we fetched /releases or /tags
  const version = new SemVer(tag);
  return { tag, version };
}
