import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/site"

export const dynamic = "force-static"

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: "*", allow: "/" },
  sitemap: absoluteUrl("/sitemap.xml"),
})

export default robots
