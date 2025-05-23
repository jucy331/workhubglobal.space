"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value?: number }>(
  ({ className, value = 0, ...props }, ref) => (
    <div ref={ref} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200", className)} {...props}>
      <div className="h-full bg-blue-600 transition-all" style={{ width: `${Math.min(Math.max(0, value), 100)}%` }} />
    </div>
  ),
)
Progress.displayName = "Progress"

export { Progress }
