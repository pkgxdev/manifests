
// code copied from https://github.com/pkgxdev/brewki
async function GET2<T>(url: URL | string): Promise<[T, Response]> {
  if (typeof url == 'string') url = new URL(url)
  const rsp = await fetch(url)
  if (!rsp.ok) throw new Error(`http: ${url}`)
  const json = await rsp.json()
  return [json as T, rsp]
}

interface GetVersionsOptions {
  server: string
  project: string
  type: 'tags' | 'releases'
}

export default async function *getVersions({ server, project, type }: GetVersionsOptions): AsyncGenerator<{ version: string, tag?: string }> {
  for await (const { version } of getVersionsLong({ server, project, type })) {
    yield {version}
  }
}

interface GLResponse {
  name: string
  created_at: Date
}

async function *getVersionsLong({ server, project, type }: GetVersionsOptions): AsyncGenerator<{ version: string, date: Date | undefined }> {

  let ismore = false

  const url = `https://${server}/api/v4/projects/${encodeURIComponent(project)}/` +
    (type === "releases" ? "releases" : "repository/tags")

  let page = 0
  do {
    page++
    const [json, rsp] = await GET2<GLResponse[]>(`${url}?per_page=100&page=${page}`)
    if (!Array.isArray(json)) throw new Error("unexpected json")
    for (const j of json) {
      yield { version: j.name, date: j.created_at }
    }

    const linkHeader = (rsp.headers as unknown as {link: string}).link
    ismore = linkHeader ? linkHeader.includes(`rel=\"next\"`) : false
  } while (ismore)
}
