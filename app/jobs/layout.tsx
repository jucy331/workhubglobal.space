import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Browse Jobs - WorkHub Global",
  description: "Find legitimate online job opportunities with flexible hours and competitive pay.",
}

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
