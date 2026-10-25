import type { Metadata, Viewport } from "next"
import { Footer, Header, Main } from "@/components/elements/layout"
import { color, font } from "@/components/theme"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site"
import "./reset.css"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: "%s｜ReArt" },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
}

export const viewport: Viewport = {
  themeColor: color.bg,
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body
        style={{
          background: color.bg,
          color: color.text,
          fontFamily: font.sans,
          lineHeight: 1.6,
          WebkitTextSizeAdjust: "100%",
        }}
      >
        <Header />
        <Main>{children}</Main>
        <Footer>
          <p>
            &copy; ReArt｜美術用語辞典 —
            美術館の言葉がわかる、美術鑑賞のための辞典。
          </p>
        </Footer>
      </body>
    </html>
  )
}
export default RootLayout
