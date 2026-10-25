import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Footer, Header, Main } from "./layout"

describe("Header", () => {
  it("renders navigation and a labeled search box", () => {
    render(<Header />)
    expect(screen.getByRole("link", { name: "用語一覧" })).toHaveAttribute(
      "href",
      expect.stringMatching(/^\/terms\/?$/)
    )
    expect(screen.getByLabelText("美術用語を検索")).toHaveAttribute("name", "q")
  })
})

describe("Main", () => {
  it("renders children inside a main element", () => {
    render(
      <Main>
        <span>body</span>
      </Main>
    )
    expect(screen.getByRole("main")).toHaveTextContent("body")
  })
})

describe("Footer", () => {
  it("renders children inside a footer element", () => {
    render(
      <Footer>
        <p>&copy; ReArt</p>
      </Footer>
    )
    expect(screen.getByText("© ReArt")).toBeInTheDocument()
  })
})
