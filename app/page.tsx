import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, Clock, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Find Your Perfect <span className="text-primary">Online Job</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg">
                Connect with top employers offering remote, freelance, and full-time positions from anywhere in the
                world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link href="/jobs">
                    Browse Jobs <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/create-account">Create Account</Link>
                </Button>
              </div>
            </div>
            <div className="space-y-8 bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-2xl">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-primary">Work From Anywhere</h2>
                <p className="text-gray-700">
                  Say goodbye to commutes and office politics. Embrace the freedom to work from your home, a coffee
                  shop, or anywhere in the world.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-primary">Set Your Own Hours</h2>
                <p className="text-gray-700">
                  Choose flexible schedules that fit your lifestyle. Work when you're most productive and enjoy better
                  work-life balance.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-primary">Grow Your Career</h2>
                <p className="text-gray-700">
                  Access opportunities from companies worldwide. Expand your skills, build your portfolio, and advance
                  your career on your terms.
                </p>
              </div>

              <div className="text-center pt-4">
                <span className="inline-block bg-primary/20 text-primary font-medium px-4 py-2 rounded-full text-sm">
                  Join 50,000+ professionals already working remotely
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose WorkHub Online?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We connect talented professionals with the best remote and online opportunities worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Remote Opportunities</h3>
              <p className="text-gray-600">
                Access hundreds of remote jobs from companies around the world, no matter where you're located.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Work</h3>
              <p className="text-gray-600">
                Find part-time, full-time, or freelance opportunities that fit your schedule and lifestyle.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quick Application</h3>
              <p className="text-gray-600">
                Our streamlined application process makes it easy to apply for multiple jobs in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Job Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through the most in-demand remote job categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/jobs?category=writing"
              className="bg-white p-6 rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
            >
              <h3 className="font-medium">Writing & Content</h3>
              <p className="text-sm text-gray-500 mt-1">124 jobs</p>
            </Link>

            <Link
              href="/jobs?category=admin"
              className="bg-white p-6 rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
            >
              <h3 className="font-medium">Admin & Support</h3>
              <p className="text-sm text-gray-500 mt-1">86 jobs</p>
            </Link>

            <Link
              href="/jobs?category=design"
              className="bg-white p-6 rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
            >
              <h3 className="font-medium">Design & Creative</h3>
              <p className="text-sm text-gray-500 mt-1">93 jobs</p>
            </Link>

            <Link
              href="/jobs?category=development"
              className="bg-white p-6 rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
            >
              <h3 className="font-medium">Development</h3>
              <p className="text-sm text-gray-500 mt-1">157 jobs</p>
            </Link>

            <Link
              href="/jobs?category=customer-support"
              className="bg-white p-6 rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
            >
              <h3 className="font-medium">Customer Support</h3>
              <p className="text-sm text-gray-500 mt-1">78 jobs</p>
            </Link>

            <Link
              href="/jobs?category=marketing"
              className="bg-white p-6 rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
            >
              <h3 className="font-medium">Marketing</h3>
              <p className="text-sm text-gray-500 mt-1">112 jobs</p>
            </Link>

            <Link
              href="/jobs?category=education"
              className="bg-white p-6 rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
            >
              <h3 className="font-medium">Education</h3>
              <p className="text-sm text-gray-500 mt-1">64 jobs</p>
            </Link>

            <Link
              href="/jobs"
              className="bg-white p-6 rounded-lg border hover:border-primary hover:shadow-md transition-all text-center"
            >
              <h3 className="font-medium">View All Categories</h3>
              <p className="text-sm text-gray-500 mt-1">800+ jobs</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Remote Job?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Create your account today and gain access to hundreds of remote opportunities.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/create-account">
              Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
