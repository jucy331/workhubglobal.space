import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/jobs" className="inline-flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to jobs
        </Link>

        <Card>
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
                  positions. Once your application is accepted, you can begin working and earning money online.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>What is the account activation fee for?</AccordionTrigger>
                <AccordionContent>
                  The one-time $5.00 activation fee helps us maintain a high-quality platform, verify serious
                  applicants, and provide ongoing support. This fee gives you unlimited access to all job listings,
                  application forms, and job alerts.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How and when will I get paid?</AccordionTrigger>
                <AccordionContent>
                  Payment methods and schedules vary by job type. Most positions pay via PayPal, direct deposit, or
                  other electronic payment methods. Payment frequencies range from weekly to monthly, depending on the
                  job. Details are provided in each job description.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How much can I expect to earn?</AccordionTrigger>
                <AccordionContent>
                  Earnings vary widely depending on the job type, your skills, and the time you commit. Some tasks pay
                  per completion (like surveys), while others pay hourly rates. Each job listing includes a pay range to
                  help set expectations.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Do I need special equipment or software?</AccordionTrigger>
                <AccordionContent>
                  Most jobs require a reliable internet connection and a computer or smartphone. Some specialized roles
                  may require additional equipment like a headset for transcription or specific software. Requirements
                  are listed in each job description.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>Can I work from any country?</AccordionTrigger>
                <AccordionContent>
                  Many jobs are available worldwide, but some may have geographic restrictions due to client
                  requirements, payment methods, or language needs. Job listings will specify any location restrictions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger>How many hours do I need to work?</AccordionTrigger>
                <AccordionContent>
                  Work hours are flexible for most positions. Some jobs allow you to work as little as a few minutes at
                  a time, while others may require a minimum weekly commitment. The time commitment is specified in each
                  job listing.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8">
                <AccordionTrigger>What happens if I'm not satisfied with a job?</AccordionTrigger>
                <AccordionContent>
                  You're free to stop working on any job that doesn't meet your expectations. We encourage you to
                  complete any tasks you've started, but you can always apply for different positions that better match
                  your skills and preferences.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
