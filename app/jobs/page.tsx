import { ArrowRight, Clock, DollarSign, FileText } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Available Online Jobs</h1>
        <p className="text-muted-foreground mb-8">
          Browse our curated selection of legitimate online opportunities with flexible hours and minimal requirements
        </p>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="transcription">Transcription</TabsTrigger>
            <TabsTrigger value="ai-training">AI Training</TabsTrigger>
            <TabsTrigger value="other">Other Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <JobCard
              id="survey-tester-001"
              title="Product Survey Tester"
              description="Share your opinions on new products and services through our detailed survey platform."
              payRange="$2-$45 per survey"
              requirements="Internet access, basic computer skills"
              tags={["Flexible", "No Experience"]}
              postedDate="May 18, 2025"
              estimatedTime="5-30 minutes per survey"
            />

            <JobCard
              id="transcription-specialist-001"
              title="Audio Transcription Specialist"
              description="Convert audio recordings into accurate text documents for our business clients."
              payRange="$15-$25 per audio hour"
              requirements="Good listening skills, typing speed (min. 50 WPM), attention to detail"
              tags={["Remote", "Flexible Hours"]}
              postedDate="May 20, 2025"
              estimatedTime="Varies by project"
            />

            <JobCard
              id="caption-creator-001"
              title="Video Caption Creator"
              description="Create accurate captions and subtitles for our media content library."
              payRange="$12-$28 per video hour"
              requirements="Good listening skills, attention to detail, knowledge of grammar"
              tags={["Remote", "Project-Based"]}
              postedDate="May 19, 2025"
              estimatedTime="1-4 hours per project"
            />

            <JobCard
              id="ai-data-labeler-001"
              title="AI Training Data Specialist"
              description="Help improve our AI systems by labeling data, reviewing content, and providing feedback."
              payRange="$10-$18 per hour"
              requirements="Attention to detail, basic computer skills"
              tags={["Growing Field", "Flexible"]}
              postedDate="May 21, 2025"
              estimatedTime="5-20 hours per week"
            />

            <JobCard
              id="microtask-worker-001"
              title="Microtask Contributor"
              description="Complete small, quick tasks like data verification, image tagging, and short research assignments."
              payRange="$5-$15 per hour"
              requirements="Internet access, basic computer skills"
              tags={["Quick Tasks", "No Experience"]}
              postedDate="May 17, 2025"
              estimatedTime="Work as little as 15 minutes at a time"
            />

            <JobCard
              id="virtual-assistant-001"
              title="Virtual Assistant"
              description="Provide administrative support to our business clients, including email management and data entry."
              payRange="$12-$22 per hour"
              requirements="Organization skills, communication, basic office software knowledge"
              tags={["Remote", "Flexible Hours"]}
              postedDate="May 16, 2025"
              estimatedTime="10-30 hours per week"
            />
          </TabsContent>

          <TabsContent value="surveys" className="space-y-6">
            <JobCard
              id="survey-tester-001"
              title="Product Survey Tester"
              description="Share your opinions on new products and services through our detailed survey platform."
              payRange="$2-$45 per survey"
              requirements="Internet access, basic computer skills"
              tags={["Flexible", "No Experience"]}
              postedDate="May 18, 2025"
              estimatedTime="5-30 minutes per survey"
            />

            <JobCard
              id="focus-group-001"
              title="Online Focus Group Participant"
              description="Join moderated discussions about products, services, or concepts with other participants."
              payRange="$50-$150 per session"
              requirements="Good communication skills, webcam, specific demographic criteria"
              tags={["High Paying", "One-time"]}
              postedDate="May 15, 2025"
              estimatedTime="60-90 minutes per session"
            />

            <JobCard
              id="product-tester-001"
              title="At-Home Product Tester"
              description="Test products at home and provide detailed feedback on your experience."
              payRange="Free products + $10-$40 per test"
              requirements="Varies by product category"
              tags={["Free Products", "Flexible"]}
              postedDate="May 14, 2025"
              estimatedTime="Varies by product"
            />
          </TabsContent>

          <TabsContent value="transcription" className="space-y-6">
            <JobCard
              id="transcription-specialist-001"
              title="Audio Transcription Specialist"
              description="Convert audio recordings into accurate text documents for our business clients."
              payRange="$15-$25 per audio hour"
              requirements="Good listening skills, typing speed (min. 50 WPM), attention to detail"
              tags={["Remote", "Flexible Hours"]}
              postedDate="May 20, 2025"
              estimatedTime="Varies by project"
            />

            <JobCard
              id="caption-creator-001"
              title="Video Caption Creator"
              description="Create accurate captions and subtitles for our media content library."
              payRange="$12-$28 per video hour"
              requirements="Good listening skills, attention to detail, knowledge of grammar"
              tags={["Remote", "Project-Based"]}
              postedDate="May 19, 2025"
              estimatedTime="1-4 hours per project"
            />

            <JobCard
              id="medical-transcription-001"
              title="Medical Transcription Specialist"
              description="Transcribe medical dictations and notes for our healthcare provider clients."
              payRange="$18-$30 per hour"
              requirements="Medical terminology knowledge, certification preferred"
              tags={["Specialized", "Higher Pay"]}
              postedDate="May 13, 2025"
              estimatedTime="10-30 hours per week"
            />
          </TabsContent>

          <TabsContent value="ai-training" className="space-y-6">
            <JobCard
              id="ai-data-labeler-001"
              title="AI Training Data Specialist"
              description="Help improve our AI systems by labeling data, reviewing content, and providing feedback."
              payRange="$10-$18 per hour"
              requirements="Attention to detail, basic computer skills"
              tags={["Growing Field", "Flexible"]}
              postedDate="May 21, 2025"
              estimatedTime="5-20 hours per week"
            />

            <JobCard
              id="content-moderator-001"
              title="Content Moderation Specialist"
              description="Review and moderate user-generated content for our client platforms."
              payRange="$12-$18 per hour"
              requirements="Good judgment, attention to detail, resilience"
              tags={["Remote", "Shift Work"]}
              postedDate="May 12, 2025"
              estimatedTime="15-30 hours per week"
            />

            <JobCard
              id="search-evaluator-001"
              title="Search Quality Evaluator"
              description="Evaluate search engine results for relevance and quality to improve our search algorithms."
              payRange="$13-$16 per hour"
              requirements="Research skills, analytical thinking, internet savvy"
              tags={["Part-time", "Flexible"]}
              postedDate="May 11, 2025"
              estimatedTime="10-25 hours per week"
            />
          </TabsContent>

          <TabsContent value="other" className="space-y-6">
            <JobCard
              id="microtask-worker-001"
              title="Microtask Contributor"
              description="Complete small, quick tasks like data verification, image tagging, and short research assignments."
              payRange="$5-$15 per hour"
              requirements="Internet access, basic computer skills"
              tags={["Quick Tasks", "No Experience"]}
              postedDate="May 17, 2025"
              estimatedTime="Work as little as 15 minutes at a time"
            />

            <JobCard
              id="virtual-assistant-001"
              title="Virtual Assistant"
              description="Provide administrative support to our business clients, including email management and data entry."
              payRange="$12-$22 per hour"
              requirements="Organization skills, communication, basic office software knowledge"
              tags={["Remote", "Flexible Hours"]}
              postedDate="May 16, 2025"
              estimatedTime="10-30 hours per week"
            />

            <JobCard
              id="online-tutor-001"
              title="Online Subject Tutor"
              description="Teach students in various subjects through our online learning platform."
              payRange="$18-$45 per hour"
              requirements="Subject expertise, teaching skills, sometimes certification"
              tags={["Flexible", "Higher Pay"]}
              postedDate="May 10, 2025"
              estimatedTime="5-25 hours per week"
            />
          </TabsContent>
        </Tabs>

        <div className="mt-10 bg-muted p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Tips for Success</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium">1. Complete Your Profile</h3>
              <p className="text-muted-foreground">
                Fill out your profile completely with accurate information and relevant skills to increase your chances
                of being selected.
              </p>
            </div>

            <div>
              <h3 className="font-medium">2. Meet Deadlines</h3>
              <p className="text-muted-foreground">
                Always submit your work on time to build a positive reputation and receive more opportunities.
              </p>
            </div>

            <div>
              <h3 className="font-medium">3. Set a Schedule</h3>
              <p className="text-muted-foreground">
                Treat online work like a regular job by setting consistent hours to maximize productivity.
              </p>
            </div>

            <div>
              <h3 className="font-medium">4. Track Your Income</h3>
              <p className="text-muted-foreground">
                Keep records of all earnings for tax purposes, as you'll be classified as an independent contractor.
              </p>
            </div>

            <div>
              <h3 className="font-medium">5. Quality Over Quantity</h3>
              <p className="text-muted-foreground">
                Focus on delivering high-quality work rather than rushing through tasks to build a strong reputation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface JobCardProps {
  id: string
  title: string
  description: string
  payRange: string
  requirements: string
  tags: string[]
  postedDate: string
  estimatedTime: string
}

function JobCard({ id, title, description, payRange, requirements, tags, postedDate, estimatedTime }: JobCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Pay Range</h3>
              <p className="text-muted-foreground">{payRange}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Time Commitment</h3>
              <p className="text-muted-foreground">{estimatedTime}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Requirements</h3>
              <p className="text-muted-foreground">{requirements}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-sm">Posted</h3>
            <p className="text-muted-foreground">{postedDate}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/jobs/${id}`} className="w-full">
          <Button className="w-full">
            View Details & Apply
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
