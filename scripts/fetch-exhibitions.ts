// artscape の東京の展覧会一覧から企画展を取得し、本文に出てくる用語を
// data/current-exhibitions.json に書き出す。`pnpm fetch:exhibitions` で実行。
// robots.txt が `*area=*&` を禁止しているため、一覧は 1 ページ目のみ取得する。
import fs from "node:fs"
import path from "node:path"

const SOURCE = "https://artscape.jp/exhibitions/?area=tokyo"
const OUT = path.join(process.cwd(), "data", "current-exhibitions.json")
const MAX_TERMS = 8
// 一般語としても使われ誤検出が多い別名
const STOP = new Set([
  "テーマ",
  "オーラ",
  "メディア",
  "媒体",
  "オリジナル",
  "風景",
  "プリント",
])

type TermLike = {
  slug: string
  term: string
  aliases: string[]
  status: string
}

const decode = (s: string) =>
  s
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#0?38;|&amp;/g, "&")
    .replace(/&#8211;/g, "–")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .trim()

const toDate = (s: string) =>
  s.replace(/(\d{4})年(\d{2})月(\d{2})日/, "$1-$2-$3")

export const parseList = (html: string) =>
  [
    ...html.matchAll(
      /<article class="item-article item-exhibitions">([\s\S]*?)<\/article>/g
    ),
  ].flatMap(([, a]) => {
    const link = a.match(
      /<h3 class="article-title"><a href="(https:\/\/artscape\.jp\/exhibitions\/(\d+)\/)"><span>([\s\S]*?)<\/span>/
    )
    const venue = a.match(/<\/h3>\s*<p>([\s\S]*?)<br>/)
    const period = a.match(
      /会期：(\d{4}年\d{2}月\d{2}日)～(\d{4}年\d{2}月\d{2}日)/
    )
    if (!link || !venue || !period) return []
    return [
      {
        id: link[2],
        url: link[1],
        title: decode(link[3]),
        venue: decode(venue[1]),
        start: toDate(period[1]),
        end: toDate(period[2]),
      },
    ]
  })

export const parseDetail = (html: string) => ({
  type: decode(html.match(/<dt>分類<\/dt>\s*<dd>([\s\S]*?)<\/dd>/)?.[1] ?? ""),
  text: decode(
    html.match(/<section class="post-content">([\s\S]*?)<\/section>/)?.[1] ?? ""
  ),
})

// 用語名・別名が本文に出てくる順に slug を返す。長い名前を優先する。
export const matchTerms = (text: string, terms: TermLike[]) => {
  const names = terms
    .filter((t) => t.status === "published")
    .flatMap((t) =>
      [t.term, ...t.aliases]
        .filter((n) => n.length >= 2 && !STOP.has(n))
        .map((n) => [n, t.slug] as const)
    )
    .sort((a, b) => b[0].length - a[0].length)
  const bySlug = new Map(names)
  const pattern = new RegExp(
    names.map(([n]) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
    "g"
  )
  return [...new Set([...text.matchAll(pattern)].map((m) => bySlug.get(m[0])!))]
}

const get = async (url: string) => {
  const res = await fetch(url, {
    headers: { "User-Agent": "reart-exhibitions-fetcher" },
  })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

const main = async () => {
  const dir = path.join(process.cwd(), "data", "terms")
  const terms: TermLike[] = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")))

  const exhibitions = []
  for (const e of parseList(await get(SOURCE))) {
    await new Promise((r) => setTimeout(r, 1000))
    const d = parseDetail(await get(e.url))
    if (!d.type.includes("企画展")) continue
    const slugs = matchTerms(`${e.title}\n${d.text}`, terms)
    exhibitions.push({ ...e, terms: slugs.slice(0, MAX_TERMS) })
  }
  if (!exhibitions.length) throw new Error("no exhibitions parsed")

  fs.writeFileSync(
    OUT,
    JSON.stringify(
      { source: SOURCE, fetchedAt: new Date().toISOString(), exhibitions },
      null,
      2
    ) + "\n"
  )
  console.log(`wrote ${exhibitions.length} exhibitions to ${OUT}`)
}

if (import.meta.main) await main()
