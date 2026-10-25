import type { MetadataRoute } from "next"
import { categories, guides, terms } from "@/lib/data"
import { absoluteUrl } from "@/lib/site"

export const dynamic = "force-static"

const sitemap = (): MetadataRoute.Sitemap => {
  const latest = terms
    .map((t) => t.updatedAt)
    .sort()
    .at(-1)
  return [
    ...["/", "/terms/", "/categories/", "/guides/"].map((p) => ({
      url: absoluteUrl(p),
      lastModified: latest,
    })),
    ...terms.map((t) => ({
      url: absoluteUrl(`/terms/${t.slug}/`),
      lastModified: t.updatedAt,
    })),
    ...categories.map((c) => ({ url: absoluteUrl(`/categories/${c.slug}/`) })),
    ...guides.map((g) => ({ url: absoluteUrl(`/guides/${g.slug}/`) })),
  ]
}

export default sitemap
