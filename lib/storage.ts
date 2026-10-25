"use client"

import { useSyncExternalStore } from "react"

// localStorage に slug の配列を保存する。使えない環境では空として扱い、閲覧は妨げない。
export const SAVED_KEY = "reart:saved"
export const LEARNED_KEY = "reart:learned"

const EMPTY: string[] = []
const listeners = new Set<() => void>()
const cache = new Map<string, { raw: string | null; value: string[] }>()

const read = (key: string): string[] => {
  let raw: string | null
  try {
    raw = localStorage.getItem(key)
  } catch {
    return EMPTY
  }
  const hit = cache.get(key)
  if (hit && hit.raw === raw) return hit.value
  let value = EMPTY
  try {
    const parsed = JSON.parse(raw ?? "[]")
    if (Array.isArray(parsed))
      value = parsed.filter((s): s is string => typeof s === "string")
  } catch {
    // 壊れた値は空として扱う
  }
  cache.set(key, { raw, value })
  return value
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  window.addEventListener("storage", cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener("storage", cb)
  }
}

export const useSlugList = (key: string) => {
  const list = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => EMPTY
  )
  const toggle = (slug: string) => {
    const next = list.includes(slug)
      ? list.filter((s) => s !== slug)
      : [...list, slug]
    try {
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      return
    }
    listeners.forEach((l) => l())
  }
  return [list, toggle] as const
}
