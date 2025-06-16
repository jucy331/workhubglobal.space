import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, Clock, Zap, FileText, Users, Briefcase, Star, Shield, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Job Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Specialized opportunities in surveys and AI training with competitive pay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/jobs?category=surveys"
              className="bg-white p-8 rounded-xl border hover:border-primary hover:shadow-lg transition-all text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Survey Specialist</h3>
              <p className="text-sm text-gray-600 mb-3">Product feedback, market research, user experience testing</p>
              <p className="text-primary font-medium">$3-$100 per survey</p>
              <Badge className="mt-2 bg-green-100 text-green-800">High Demand</Badge>
            </Link>

            <Link
              href="/jobs?category=ai-training"
              className="bg-white p-8 rounded-xl border hover:border-primary hover:shadow-lg transition-all text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Training</h3>
              <p className="text-sm text-gray-600 mb-3">Chatbot training, content evaluation, data labeling</p>
              <p className="text-primary font-medium">$12-$25 per hour</p>
              <Badge className="mt-2 bg-blue-100 text-blue-800">Growing Field</Badge>
            </Link>

            <Link
              href="/jobs?category=data-entry"
              className="bg-white p-8 rounded-xl border hover:border-primary hover:shadow-lg transition-all text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Data Processing</h3>
              <p className="text-sm text-gray-600 mb-3">Data entry, transcription, content moderation</p>
              <p className="text-primary font-medium">$11-$17 per hour</p>
              <Badge className="mt-2 bg-orange-100 text-orange-800">Steady Work</Badge>
            </Link>

            <Link
              href="/create-job"
              className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl text-white text-center group hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Post a Job</h3>
              <p className="text-sm text-blue-100 mb-3">Need work done? Create your own job posting</p>
              <p className="text-white font-medium">Start hiring →</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Workers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied workers earning money from home
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "I've earned over $500 in my first month doing surveys and AI training tasks. The payments are always on
                time and the work is genuinely interesting."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  S
                </div>
                <div className="ml-3">
                  <p className="font-medium">Sarah M.</p>
                  <p className="text-sm text-gray-600">Remote Worker, California</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Perfect for supplementing my income. I work 2-3 hours in the evenings and make an extra $300-400 per
                month. Highly recommend!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                  M
                </div>
                <div className="ml-3">
                  <p className="font-medium">Mike J.</p>
                  <p className="text-sm text-gray-600">Part-time Worker, Texas</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The AI training jobs are fascinating and well-paid. I've learned so much while earning money. The
                platform is professional and trustworthy."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                  A
                </div>
                <div className="ml-3">
                  <p className="font-medium">Alex R.</p>
                  <p className="text-sm text-gray-600">AI Trainer, New York</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-8">Trusted by workers worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-green-600" />
                <span className="font-medium">Secure Payments</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-blue-600" />
                <span className="font-medium">Verified Jobs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-purple-600" />
                <span className="font-medium">50K+ Workers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-6 w-6 text-yellow-500" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
            </div>
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
