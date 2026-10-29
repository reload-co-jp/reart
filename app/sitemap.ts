import type { MetadataRoute } from "next"
import {
  categories,
  getTerms,
  guides,
  lastUpdated,
  terms,
  termsInCategory,
} from "@/lib/data"
import { absoluteUrl } from "@/lib/site"

export const dynamic = "force-static"

const sitemap = (): MetadataRoute.Sitemap => {
  const latest = lastUpdated(terms)
  return [
    ...[
      "/",
      "/terms/",
      "/categories/",
      "/guides/",
      "/exhibitions/",
      "/exhibitions/current/",
    ].map((p) => ({
      url: absoluteUrl(p),
      lastModified: latest,
    })),
    ...terms.map((t) => ({
      url: absoluteUrl(`/terms/${t.slug}/`),
      lastModified: t.updatedAt,
    })),
    ...categories.map((c) => ({
      url: absoluteUrl(`/categories/${c.slug}/`),
      lastModified: lastUpdated(termsInCategory(c.slug)),
    })),
    ...guides.map((g) => ({
      url: absoluteUrl(`/guides/${g.slug}/`),
      lastModified: lastUpdated(getTerms(g.steps.map((s) => s.slug))),
    })),
  ]
}

export default sitemap
