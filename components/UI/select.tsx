"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string
  }
>(({ className, children, label, ...props }, ref) => (
  <div className="relative">
    {label && <label className="text-sm font-medium mb-1 block">{label}</label>}
    <select
      ref={ref}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
  </div>
))
Select.displayName = "Select"

// Simplified versions of the select components
const SelectTrigger = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center", className)} {...props}>
    {children}
  </div>
)

const SelectValue = ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={className} {...props}>
    {children}
  </span>
)

const SelectContent = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-white border rounded-md shadow-md mt-1 p-1", className)} {...props}>
    {children}
  </div>
)

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value?: string }>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("px-2 py-1.5 text-sm rounded hover:bg-gray-100 cursor-pointer", className)} {...props}>
      {children}
    </div>
  ),
)
SelectItem.displayName = "SelectItem"

// Simplified implementation for the applications page
export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
