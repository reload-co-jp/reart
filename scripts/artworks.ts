// 美術館の公開 API から用語に関連する作品を検索し、data/artworks.json に保存して
// data/term-artworks.json で用語と紐付ける。キーワード一致だけで自動掲載せず、
// search の結果から人が add で選ぶ。
//   pnpm artworks search <slug> [keyword] [--page N]
//   pnpm artworks add <slug> <artworkId> <keyword> [理由]
//   pnpm artworks remove <slug> <artworkId>
//   pnpm artworks refresh [artworkId]   指定作品、または画像取得エラーの作品を再取得
//   pnpm artworks collect [--replace]   作品が足りない用語に有名作の候補を未確認で登録
//                                       --replace は未確認の候補を捨てて取り直す
// collect は Wikidata の言語版数（有名さの目安）順の作品を優先し、足りなければ
// Cleveland の館選定ハイライトで補う。候補には unchecked が付く。add し直すと確認済みになる。
// 表示順は data/term-artworks.json の配列順。並べ替えはファイルを直接編集する。
//
// 利用条件の判定（CC0 / Public Domain のみ保存）
//   The Met: isPublicDomain（Open Access = CC0）
//   Cleveland: share_license_status === "CC0"
//   Wikidata: 画像（Wikimedia Commons）のライセンスが pd / cc0
import fs from "node:fs"
import path from "node:path"
import type { Artwork, TermArtwork } from "../lib/types"

const DATA = path.join(process.cwd(), "data")
const ARTWORKS = path.join(DATA, "artworks.json")
const LINKS = path.join(DATA, "term-artworks.json")
const IMAGES = path.join(process.cwd(), "public", "artworks")
const PER_PAGE = 10
const COLLECT_PER_TERM = 3
// Wikimedia は連絡先入りの User-Agent を求める
const UA = {
  "User-Agent":
    "reart-artworks-fetcher (https://github.com/reload-co-jp/reart)",
}

type Found = Omit<Artwork, "id" | "localImagePath" | "downloadedAt" | "error">
type Adapter = {
  search: (q: string, page: number) => Promise<Found[]>
  // 利用条件を確認できない作品は undefined
  get: (sourceId: string) => Promise<Found | undefined>
}

const strip = (s = "") => s.replace(/<[^>]+>/g, "").trim()
const enc = encodeURIComponent

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const getJson = async (url: string) => {
  const res = await fetch(url, { headers: UA })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

const MET = "https://collectionapi.metmuseum.org/public/collection"
const met: Adapter = {
  // v1.1 の検索は ID のみ返すので、1 件ずつ詳細を取る。
  // 公称 80 req/s だが連続すると 403 で弾かれるため間隔を空ける
  async search(q, page) {
    const r = await getJson(
      `${MET}/v1.1/search?hasImages=true&q=${enc(q)}&offset=${page * PER_PAGE}&limit=${PER_PAGE}`
    )
    const found = []
    for (const id of r.objectIDs ?? []) {
      await sleep(1000)
      // 検索インデックスに残った削除済み作品は 404 になるので飛ばす
      const a = await met.get(String(id)).catch((e) => {
        if (!String(e).includes("404")) throw e
      })
      if (a) found.push(a)
    }
    return found
  },
  async get(id) {
    const o = await getJson(`${MET}/v1/objects/${id}`)
    if (!o.isPublicDomain || !o.primaryImage) return
    return {
      source: "met",
      sourceId: String(o.objectID),
      title: o.title,
      artist: o.artistDisplayName,
      date: o.objectDate,
      museum: "The Metropolitan Museum of Art",
      description: "",
      imageUrl: o.primaryImageSmall || o.primaryImage,
      sourceUrl: o.objectURL,
      rights: "CC0（The Met Open Access）",
    }
  },
}

const CMA = "https://openaccess-api.clevelandart.org/api/artworks"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fromCma = (d: any): Found | undefined =>
  d.share_license_status === "CC0" && d.images?.web?.url
    ? {
        source: "cma",
        sourceId: String(d.id),
        title: d.title,
        artist: (d.creators ?? [])
          .map((c: { description: string }) => c.description)
          .join(", "),
        date: d.creation_date ?? "",
        museum: "The Cleveland Museum of Art",
        description: strip(d.description ?? d.wall_description ?? ""),
        imageUrl: d.images.web.url,
        sourceUrl: d.url,
        rights: "CC0（Cleveland Museum of Art Open Access）",
      }
    : undefined
const cma: Adapter = {
  async search(q, page) {
    const r = await getJson(
      `${CMA}/?q=${enc(q)}&has_image=1&cc0=1&limit=${PER_PAGE}&skip=${page * PER_PAGE}`
    )
    return r.data.map(fromCma).filter(Boolean)
  },
  get: async (id) => fromCma((await getJson(`${CMA}/${id}`)).data),
}

const cmaHighlight: Adapter = {
  ...cma,
  async search(q, page) {
    const r = await getJson(
      `${CMA}/?q=${enc(q)}&has_image=1&cc0=1&highlight=1&limit=${PER_PAGE}&skip=${page * PER_PAGE}`
    )
    return r.data.map(fromCma).filter(Boolean)
  },
}

const sparql = async (q: string) =>
  (
    await getJson(
      `https://query.wikidata.org/sparql?format=json&query=${enc(q)}`
    )
  ).results.bindings

type Commons = { url: string; license: string }
export const fromWikidata = (
  id: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  r: any,
  c?: Commons
): Found | undefined =>
  r?.image && c && /^(pd|cc0)/i.test(c.license)
    ? {
        source: "wikidata",
        sourceId: id,
        title: r.title?.value ?? "",
        artist: r.artist?.value ?? "",
        date: r.year?.value ?? "",
        museum: r.museum?.value ?? "",
        description: "",
        imageUrl: c.url,
        sourceUrl: `https://www.wikidata.org/wiki/${id}`,
        rights: `${c.license === "cc0" ? "CC0" : "Public Domain"}（Wikimedia Commons）`,
      }
    : undefined

// P18 の Special:FilePath URL から、縮小画像の URL とライセンスを引く
const commons = async (filePath: string): Promise<Commons | undefined> => {
  const title = "File:" + decodeURIComponent(filePath.split("/").pop()!)
  const r = await getJson(
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200&titles=${enc(title)}`
  )
  const [page] = Object.values(r.query.pages) as {
    imageinfo?: {
      url: string
      thumburl?: string
      extmetadata?: { License?: { value: string } }
    }[]
  }[]
  const ii = page?.imageinfo?.[0]
  if (!ii) return
  return {
    url: (ii.thumburl ?? ii.url).split("?")[0],
    license: ii.extmetadata?.License?.value ?? "",
  }
}

const wikidata: Adapter = {
  // 用語を上位 3 件の項目に解決し（同名の人名・作品を拾っても下の条件で落ちる）、
  // その様式・ジャンル・素材を持つ作品を言語版数順に取る。作者と所蔵先の
  // 無いもの（運動に属する人物など）は除く
  async search(q, page) {
    const s = await getJson(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&limit=3&search=${enc(q)}`
    )
    const ids = s.search.map((x: { id: string }) => `wd:${x.id}`).join(" ")
    if (!ids) return []
    const rows = await sparql(
      `SELECT DISTINCT ?w ?s WHERE { VALUES ?m { ${ids} } ?w wdt:P135|wdt:P136|wdt:P186 ?m; wdt:P18 []; wdt:P170 []; wdt:P195 []; wikibase:sitelinks ?s. } ORDER BY DESC(?s) LIMIT ${PER_PAGE} OFFSET ${page * PER_PAGE}`
    )
    const found = []
    for (const r of rows) {
      await sleep(1000)
      const a = await wikidata.get(r.w.value.split("/").pop())
      if (a) found.push(a)
    }
    return found
  },
  async get(id) {
    const [r] = await sparql(
      `SELECT (SAMPLE(?img) AS ?image) (COALESCE(SAMPLE(?l), SAMPLE(?lj), SAMPLE(?la)) AS ?title) (GROUP_CONCAT(DISTINCT ?al; separator=", ") AS ?artist) (SAMPLE(?ml) AS ?museum) (MIN(YEAR(?d)) AS ?year) WHERE { wd:${id} wdt:P18 ?img. OPTIONAL { wd:${id} rdfs:label ?l FILTER(lang(?l) = "en") } OPTIONAL { wd:${id} rdfs:label ?lj FILTER(lang(?lj) = "ja") } OPTIONAL { wd:${id} rdfs:label ?la } OPTIONAL { wd:${id} wdt:P170/rdfs:label ?al FILTER(lang(?al) = "en") } OPTIONAL { wd:${id} wdt:P195/rdfs:label ?ml FILTER(lang(?ml) = "en") } OPTIONAL { wd:${id} wdt:P571 ?d } }`
    )
    return fromWikidata(id, r, r?.image && (await commons(r.image.value)))
  },
}

const adapters: Record<Artwork["source"], Adapter> = { met, cma, wikidata }

const read = <T>(file: string, empty: T): T =>
  fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : empty
const write = (file: string, data: unknown) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n")

const download = async (a: Artwork): Promise<Artwork> => {
  try {
    const res = await fetch(a.imageUrl, { headers: UA })
    if (!res.ok) throw new Error(`${res.status} ${a.imageUrl}`)
    const ext = path.extname(new URL(a.imageUrl).pathname) || ".jpg"
    const file = a.id.replace(/[^\w-]/g, "-") + ext
    fs.mkdirSync(IMAGES, { recursive: true })
    fs.writeFileSync(
      path.join(IMAGES, file),
      Buffer.from(await res.arrayBuffer())
    )
    return {
      ...a,
      localImagePath: `/artworks/${file}`,
      downloadedAt: new Date().toISOString(),
      error: undefined, // JSON に書き出すと消える
    }
  } catch (e) {
    return { ...a, error: String(e) }
  }
}

// 画像を保存し、artworks.json を更新する
const saveArtwork = async (found: Found, artworks: Artwork[]) => {
  const id = `${found.source}:${found.sourceId}`
  const a = await download({ ...found, id })
  const rest = artworks.filter((x) => x.id !== id)
  write(ARTWORKS, [...rest, a])
  console.log(a.error ? `画像取得エラー ${id}: ${a.error}` : `saved ${id}`)
  return [...rest, a]
}

// 詳細を取り直して保存する
const fetchArtwork = async (id: string, artworks: Artwork[]) => {
  const i = id.indexOf(":")
  const source = id.slice(0, i) as Artwork["source"]
  if (!adapters[source]) throw new Error(`unknown source in "${id}"`)
  const found = await adapters[source].get(id.slice(i + 1))
  if (!found)
    throw new Error(`${id}: 画像または利用条件（CC0 / PD）を確認できない`)
  return saveArtwork(found, artworks)
}

// "Blank space / Negative space" や "Matière (仏)" から検索語を取り出す
export const toQuery = (english: string) =>
  english
    .split("/")[0]
    .replace(/\(.*?\)/g, "")
    .trim()

type TermLike = { slug: string; term: string; english?: string; status: string }

const loadTerms = (): TermLike[] => {
  const dir = path.join(DATA, "terms")
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")))
}

const loadTerm = (slug: string) => {
  const term = loadTerms().find((t) => t.slug === slug)
  if (!term) throw new Error(`unknown term "${slug}"`)
  return term
}

const main = async () => {
  const [cmd, ...args] = process.argv.slice(2)
  const artworks = read<Artwork[]>(ARTWORKS, [])
  const links = read<Record<string, TermArtwork[]>>(LINKS, {})

  if (cmd === "search") {
    const pageAt = args.indexOf("--page")
    const page = pageAt >= 0 ? Number(args.splice(pageAt, 2)[1]) - 1 : 0
    const [slug, keyword] = args
    const t = loadTerm(slug)
    const linked = new Set((links[slug] ?? []).map((l) => l.artworkId))
    // 収蔵品データが英語なので英語表記で検索する
    const q = keyword ?? toQuery(t.english ?? t.term)
    for (const source of Object.keys(adapters)) {
      console.log(`\n## ${source} "${q}" page ${page + 1}`)
      try {
        for (const a of await adapters[source as Artwork["source"]].search(
          q,
          page
        )) {
          const id = `${source}:${a.sourceId}`
          console.log(
            `${linked.has(id) ? "*" : " "} ${id}  ${a.title} / ${a.artist || "作者不詳"} / ${a.date} / ${a.rights}\n    ${a.sourceUrl}`
          )
        }
      } catch (e) {
        console.error(`  ${e}`)
      }
      await sleep(500)
    }
  } else if (cmd === "add") {
    const [slug, id, keyword, reason = ""] = args
    if (!keyword)
      throw new Error("usage: add <slug> <artworkId> <keyword> [理由]")
    loadTerm(slug)
    await fetchArtwork(id, artworks)
    // collect の候補を add し直すと確認済みになる
    const list = (links[slug] ?? []).filter((l) => l.artworkId !== id)
    const at = (links[slug] ?? []).findIndex((l) => l.artworkId === id)
    list.splice(at < 0 ? list.length : at, 0, {
      artworkId: id,
      keyword,
      reason,
    })
    write(LINKS, { ...links, [slug]: list })
  } else if (cmd === "remove") {
    const [slug, id] = args
    // 作品自体は他の用語から参照されうるので残す
    write(LINKS, {
      ...links,
      [slug]: (links[slug] ?? []).filter((l) => l.artworkId !== id),
    })
  } else if (cmd === "collect") {
    const replace = args.includes("--replace")
    let current = artworks
    for (const t of loadTerms()) {
      if (t.status !== "published") continue
      const q = toQuery(t.english ?? t.term)
      const list = (links[t.slug] ?? []).filter(
        (l) => !(replace && l.unchecked)
      )
      for (const [source, adapter, reason] of [
        ["wikidata", wikidata, "代表作（Wikidata 言語版数順、未確認）"],
        ["cma", cmaHighlight, "館のハイライト（未確認）"],
      ] as const) {
        if (list.length >= COLLECT_PER_TERM) break
        try {
          for (const found of await adapter.search(q, 0)) {
            if (list.length >= COLLECT_PER_TERM) break
            const id = `${source}:${found.sourceId}`
            if (list.some((l) => l.artworkId === id)) continue
            current = await saveArtwork(found, current)
            list.push({ artworkId: id, keyword: q, reason, unchecked: true })
          }
        } catch (e) {
          console.error(`${t.slug} ${source}: ${e}`)
        }
      }
      links[t.slug] = list
      write(LINKS, links)
      console.log(`${t.slug} "${q}": ${list.length}`)
    }
    if (replace) {
      // どの用語からも参照されなくなった作品と画像を消す
      const used = new Set(
        Object.values(links)
          .flat()
          .map((l) => l.artworkId)
      )
      for (const a of current)
        if (!used.has(a.id) && a.localImagePath)
          fs.rmSync(path.join(process.cwd(), "public", a.localImagePath), {
            force: true,
          })
      write(
        ARTWORKS,
        current.filter((a) => used.has(a.id))
      )
    }
  } else if (cmd === "refresh") {
    const ids = args.length
      ? args
      : artworks.filter((a) => a.error || !a.localImagePath).map((a) => a.id)
    let current = artworks
    for (const id of ids) {
      try {
        current = await fetchArtwork(id, current)
      } catch (e) {
        console.error(String(e))
      }
    }
    if (!ids.length) console.log("no errors")
  } else {
    console.log(
      fs
        .readFileSync(import.meta.filename, "utf8")
        .split("\n")
        .slice(0, 8)
        .join("\n")
    )
  }
}

if (import.meta.main) await main()
