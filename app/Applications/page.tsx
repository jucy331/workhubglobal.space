"use client"

import { FileText, CheckCircle, Clock, XCircle } from "lucide-react"

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
}

const statusIcons: Record<string, JSX.Element> = {
  Pending: <Clock className="h-4 w-4 mr-1" />,
  Accepted: <CheckCircle className="h-4 w-4 mr-1" />,
  Rejected: <XCircle className="h-4 w-4 mr-1" />,
}

export default function ApplicationsPage() {
  const applications = [
    { id: "1", job: "Product Survey Tester", status: "Pending", date: "2025-05-20" },
    { id: "2", job: "AI Training Data Specialist", status: "Accepted", date: "2025-05-10" },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6 flex items-center gap-3">
        <FileText className="h-8 w-8 text-purple-600" />
        My Applications
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-8">
        {applications.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            You have not applied to any jobs yet.
          </div>
        ) : (
          <ul className="divide-y">
            {applications.map(app => (
              <li key={app.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-lg">{app.job}</div>
                  <div className="text-xs text-gray-500">Applied on {app.date}</div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusStyles[app.status]}`}>
                  {statusIcons[app.status]}
                  {app.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
