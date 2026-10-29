"use client"

import { CSSProperties, FC, useRef } from "react"
import { color } from "@/components/theme"

// 画像タップで全画面表示。Esc・背景タップで閉じる
export const ImageViewer: FC<{
  src: string
  alt: string
  style?: CSSProperties
}> = ({ src, alt, style }) => {
  const ref = useRef<HTMLDialogElement>(null)
  return (
    <>
      <button
        type="button"
        aria-label={`${alt}を拡大表示`}
        onClick={() => ref.current?.showModal()}
        style={{
          background: "none",
          border: 0,
          cursor: "zoom-in",
          display: "block",
          padding: 0,
          width: "100%",
        }}
      >
        <img src={src} alt={alt} loading="lazy" style={style} />
      </button>
      <dialog
        ref={ref}
        aria-label={alt}
        style={{
          background: "rgba(0, 0, 0, 0.9)",
          border: 0,
          height: "100dvh",
          margin: 0,
          maxHeight: "none",
          maxWidth: "none",
          padding: 0,
          width: "100vw",
        }}
      >
        <button
          type="button"
          aria-label="閉じる"
          onClick={() => ref.current?.close()}
          style={{
            background: "none",
            border: 0,
            color: color.inverse,
            cursor: "zoom-out",
            display: "block",
            height: "100%",
            padding: 0,
            position: "relative",
            width: "100%",
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{ height: "100%", objectFit: "contain", width: "100%" }}
          />
          <span
            aria-hidden
            style={{
              fontSize: "2rem",
              lineHeight: 1,
              padding: "1rem",
              position: "absolute",
              right: 0,
              top: 0,
            }}
          >
            ×
          </span>
        </button>
      </dialog>
    </>
  )
}
