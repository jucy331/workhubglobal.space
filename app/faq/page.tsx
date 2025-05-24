import Link from "next/link"
import { ArrowLeft, Star, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment:
      "Amazing platform! I've earned over $2,000 in my first month doing surveys and data entry. The payment is always on time.",
    date: "2 days ago",
    verified: true,
  },
  {
    id: 2,
    name: "Mike Chen",
    rating: 5,
    comment: "Great variety of jobs. The AI training tasks are really interesting and pay well. Highly recommend!",
    date: "1 week ago",
    verified: true,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    rating: 4,
    comment: "Easy to use platform with legitimate opportunities. Customer support is responsive and helpful.",
    date: "2 weeks ago",
    verified: true,
  },
  {
    id: 4,
    name: "David Thompson",
    rating: 5,
    comment:
      "Perfect for flexible work. I work around my schedule and still make good money. The $5 activation fee was worth it!",
    date: "3 weeks ago",
    verified: true,
  },
  {
    id: 5,
    name: "Lisa Park",
    rating: 5,
    comment: "Love the variety of survey opportunities. Quick payments and clear instructions for every task.",
    date: "1 month ago",
    verified: true,
  },
  {
    id: 6,
    name: "James Wilson",
    rating: 4,
    comment:
      "Solid platform for remote work. The transcription jobs are my favorite - good pay for straightforward work.",
    date: "1 month ago",
    verified: true,
  },
]

export default function FAQPage() {
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/jobs" className="inline-flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to jobs
        </Link>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Frequently Asked Questions</CardTitle>
            <CardDescription>
              Find answers to the most common questions about our platform and online jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I get started with online jobs?</AccordionTrigger>
                <AccordionContent>
                  To get started, create an account, browse available jobs, and activate your account to apply for
                  positions. Once your application is accepted, you can begin working and earning money online. The
                  process is simple: Sign up → Activate account ($5) → Browse jobs → Apply → Start earning!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>What is the account activation fee for?</AccordionTrigger>
                <AccordionContent>
                  The one-time $5.00 activation fee helps us maintain a high-quality platform, verify serious
                  applicants, and provide ongoing support. This fee gives you unlimited access to all job listings,
                  application forms, job alerts, and priority customer support. It also helps us filter out spam and
                  ensure all users are committed to legitimate work opportunities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How and when will I get paid?</AccordionTrigger>
                <AccordionContent>
                  Payment methods and schedules vary by job type. Most positions pay via PayPal, direct deposit, or
                  other electronic payment methods. Payment frequencies range from same-day (for surveys) to weekly or
                  bi-weekly (for ongoing projects). All payment details are clearly specified in each job description.
                  We ensure fast, secure payments with detailed tracking in your dashboard.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How much can I expect to earn?</AccordionTrigger>
                <AccordionContent>
                  Earnings vary widely depending on the job type, your skills, and the time you commit. Survey tasks
                  typically pay $2-$100 per completion, AI training roles pay $12-$25 per hour, and data entry positions
                  offer $10-$17 per hour. Many of our active users earn $500-$2,000+ per month working part-time. Your
                  earning potential increases as you build a good reputation and gain access to higher-paying
                  opportunities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Do I need special equipment or software?</AccordionTrigger>
                <AccordionContent>
                  Most jobs require only a reliable internet connection and a computer or smartphone. Some specialized
                  roles may require additional equipment like a headset for transcription or specific software for AI
                  training. All requirements are clearly listed in each job description. For most survey and data entry
                  work, basic computer skills and internet access are sufficient to get started.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Can I work from any country?</AccordionTrigger>
                <AccordionContent>
                  Many jobs are available worldwide, but some may have geographic restrictions due to client
                  requirements, payment methods, or language needs. We have opportunities for workers in the US, Canada,
                  UK, Australia, and many other countries. Job listings will specify any location restrictions. Payment
                  methods like PayPal are available globally, making it easy to receive earnings regardless of location.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>How many hours do I need to work?</AccordionTrigger>
                <AccordionContent>
                  Work hours are completely flexible for most positions. Some jobs allow you to work as little as 5-10
                  minutes at a time (like quick surveys), while others may require a minimum weekly commitment of 10-20
                  hours. You can work around your existing schedule - early morning, evenings, weekends, or whenever
                  convenient. The time commitment is always specified in each job listing, so you can choose what fits
                  your lifestyle.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>What happens if I'm not satisfied with a job?</AccordionTrigger>
                <AccordionContent>
                  You're free to stop working on any job that doesn't meet your expectations. We encourage you to
                  complete any tasks you've started to maintain a good reputation, but you can always apply for
                  different positions that better match your skills and preferences. Our platform offers a wide variety
                  of opportunities, so you can find work that suits your interests and schedule. Customer support is
                  always available to help resolve any issues.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger>Is this platform legitimate and safe?</AccordionTrigger>
                <AccordionContent>
                  Yes, our platform is completely legitimate and safe. We work with verified companies and maintain
                  strict quality standards for all job postings. Your personal information is protected with
                  industry-standard security measures, and we never ask for sensitive information like SSN or bank
                  details upfront. All payments are processed through secure, established payment providers like PayPal
                  and direct bank transfers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger>How do I improve my chances of getting accepted for jobs?</AccordionTrigger>
                <AccordionContent>
                  To improve your acceptance rate: 1) Complete your profile thoroughly with accurate information, 2)
                  Start with beginner-friendly jobs to build your reputation, 3) Follow instructions carefully and
                  submit high-quality work, 4) Respond promptly to job opportunities, and 5) Maintain good communication
                  with clients. Building a strong track record with positive ratings will give you access to
                  higher-paying opportunities over time.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Dynamic Reviews Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              What Our Users Say
            </CardTitle>
            <CardDescription className="flex items-center">
              <span className="text-2xl font-bold text-yellow-500 mr-2">{averageRating.toFixed(1)}</span>
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= averageRating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-gray-600">({reviews.length} reviews)</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm flex items-center">
                          {review.name}
                          {review.verified && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= review.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">Join thousands of satisfied users earning money from home</p>
                          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
