import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, DollarSign, ExternalLink } from "lucide-react"
import Image from "next/image"

interface JobCardProps {
  job: {
    id: string
    title: string
    company: string
    location: string
    salary: string
    type: string[]
    category: string
    postedAt: string
    logo: string
    url?: string
  }
}

export default function JobCard({ job }: JobCardProps) {
  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    } catch (e) {
      return dateString
    }
  }

  // Calculate days ago
  const getDaysAgo = (dateString: string) => {
    try {
      const postedDate = new Date(dateString)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - postedDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return "Today"
      if (diffDays === 1) return "Yesterday"
      return `${diffDays} days ago`
    } catch (e) {
      return "Recently"
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex items-start gap-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-gray-50">
            <Image
              src={job.logo || "/placeholder.svg?height=80&width=80"}
              alt={`${job.company} logo`}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-lg line-clamp-2">{job.title}</h3>
            <p className="text-sm text-gray-500">{job.company}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.type.map((type) => (
            <Badge key={type} variant="secondary" className="capitalize">
              {type}
            </Badge>
          ))}
          <Badge variant="outline" className="capitalize">
            {job.category}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 shrink-0" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Posted {getDaysAgo(job.postedAt)}</span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 mt-auto">
        <Button className="w-full" asChild>
          {job.url ? (
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              Apply Now <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          ) : (
            <Link href={`/apply/${job.id}`}>Apply Now</Link>
          )}
        </Button>
      </div>
    </div>
  )
}
