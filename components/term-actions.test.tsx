import { afterEach, describe, expect, it } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { TermActions } from "./term-actions"

afterEach(() => {
  cleanup()
  localStorage.clear()
})

describe("TermActions", () => {
  it("persists saved state across remounts (page reload)", () => {
    render(<TermActions slug="textile" />)
    fireEvent.click(screen.getByRole("button", { name: "☆ 保存する" }))
    expect(JSON.parse(localStorage.getItem("reart:saved")!)).toEqual([
      "textile",
    ])

    cleanup()
    render(<TermActions slug="textile" />)
    expect(screen.getByRole("button", { name: "★ 保存済み" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
  })

  it("keeps saved and learned separate and toggles off", () => {
    render(<TermActions slug="textile" />)
    fireEvent.click(screen.getByRole("button", { name: "学習済みにする" }))
    expect(localStorage.getItem("reart:saved")).toBeNull()
    fireEvent.click(screen.getByRole("button", { name: "✓ 学習済み" }))
    expect(JSON.parse(localStorage.getItem("reart:learned")!)).toEqual([])
  })

  it("ignores corrupted storage", () => {
    localStorage.setItem("reart:saved", "{broken")
    render(<TermActions slug="textile" />)
    expect(
      screen.getByRole("button", { name: "☆ 保存する" })
    ).toBeInTheDocument()
  })
})
