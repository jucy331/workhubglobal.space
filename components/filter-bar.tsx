"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import type { JobCategory, JobType } from "@/lib/jobs"

const categories: { value: JobCategory; label: string }[] = [
  { value: "writing", label: "Writing & Content" },
  { value: "admin", label: "Admin & Support" },
  { value: "design", label: "Design & Creative" },
  { value: "development", label: "Development" },
  { value: "customer-support", label: "Customer Support" },
  { value: "marketing", label: "Marketing" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
]

const jobTypes: { value: JobType; label: string }[] = [
  { value: "remote", label: "Remote" },
  { value: "freelance", label: "Freelance" },
  { value: "part-time", label: "Part-time" },
  { value: "full-time", label: "Full-time" },
]

export default function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from search params
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(
    (searchParams.get("category") as JobCategory) || null,
  )
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>((searchParams.getAll("type") as JobType[]) || [])

  // Update state when search params change
  useEffect(() => {
    setSearch(searchParams.get("search") || "")
    setSelectedCategory((searchParams.get("category") as JobCategory) || null)
    setSelectedTypes((searchParams.getAll("type") as JobType[]) || [])
  }, [searchParams])

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Update search param
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }

    // Update category param
    if (selectedCategory) {
      params.set("category", selectedCategory)
    } else {
      params.delete("category")
    }

    // Update type params
    params.delete("type") // Remove all existing type params
    selectedTypes.forEach((type) => {
      params.append("type", type)
    })

    // Reset page to 1 when filters change
    params.set("page", "1")

    router.push(`/jobs?${params.toString()}`)
  }

  const handleCategorySelect = (category: JobCategory) => {
    setSelectedCategory(category === selectedCategory ? null : category)
  }

  const handleTypeToggle = (type: JobType) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleReset = () => {
    setSearch("")
    setSelectedCategory(null)
    setSelectedTypes([])
    router.push("/jobs?page=1")
  }

  // Handle Enter key in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto justify-between">
              {selectedCategory ? categories.find((c) => c.value === selectedCategory)?.label : "Category"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Job Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.value}
                checked={selectedCategory === category.value}
                onCheckedChange={() => handleCategorySelect(category.value)}
              >
                {category.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto justify-between">
              Job Type
              {selectedTypes.length > 0 && ` (${selectedTypes.length})`}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Job Types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {jobTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type.value}
                checked={selectedTypes.includes(type.value)}
                onCheckedChange={() => handleTypeToggle(type.value)}
              >
                {type.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={handleSearch} className="w-full md:w-auto">
          Search
        </Button>

        {(selectedCategory || selectedTypes.length > 0 || search) && (
          <Button variant="ghost" onClick={handleReset} className="w-full md:w-auto">
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
