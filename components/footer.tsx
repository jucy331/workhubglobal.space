import Link from "next/link"
import { Briefcase } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
              <Briefcase className="h-5 w-5" />
              <span>WorkHub Online</span>
            </Link>
            <p className="text-sm text-gray-600">
              Connect with top employers offering remote, freelance, and full-time positions from anywhere in the world.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/activate-account" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Activate Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/jobs?category=writing"
                  className="text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  Writing
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?category=admin"
                  className="text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  Admin
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?category=design"
                  className="text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  Design
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?category=customer-support"
                  className="text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} WorkHub Online. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
