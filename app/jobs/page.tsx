"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Job categories for tabs
const categories = [
  { key: "all", label: "All Jobs" },
  { key: "surveys", label: "Surveys" },
  { key: "transcription", label: "Transcription" },
  { key: "captioning", label: "Captioning" },
  { key: "ai", label: "AI Training" },
  { key: "writing", label: "Writing" },
  { key: "other", label: "Other Tasks" },
];

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  pay: string;
  requirements: string;
  posted: string;
  time: string;
  tags: string[];
  category: string;
}

const JOBS: Job[] = [
  // Surveys
  {
    id: "survey-001",
    title: "Product Survey Tester",
    company: "SurveyGenius",
    description: "Share your opinions on new products and services through our detailed survey platform.",
    pay: "$2-$45 per survey",
    requirements: "Internet access, basic computer skills",
    posted: "May 18, 2025",
    time: "5-30 minutes per survey",
    tags: ["Flexible", "No Experience"],
    category: "surveys",
  },
  {
    id: "survey-002",
    title: "Mobile App Surveyor",
    company: "AppPulse",
    description: "Test mobile apps and complete short surveys about your experience.",
    pay: "$3-$10 per survey",
    requirements: "Smartphone, internet access",
    posted: "May 19, 2025",
    time: "10-20 minutes per survey",
    tags: ["Flexible", "Remote"],
    category: "surveys",
  },
  {
    id: "survey-003",
    title: "Consumer Feedback Panelist",
    company: "PanelPro",
    description: "Participate in online panels and provide feedback on consumer products.",
    pay: "$5-$20 per panel",
    requirements: "Internet access, 18+ years old",
    posted: "May 20, 2025",
    time: "15-45 minutes per panel",
    tags: ["Flexible", "No Experience"],
    category: "surveys",
  },
  // Transcription
  {
    id: "transcription-001",
    title: "Audio Transcription Specialist",
    company: "AudioText Inc.",
    description: "Transcribe audio files for various clients.",
    pay: "$15-$25 per audio hour",
    requirements: "Good listening skills, typing speed (min. 50 WPM)",
    posted: "May 18, 2025",
    time: "Varies by project",
    tags: ["Remote", "Flexible Hours"],
    category: "transcription",
  },
  {
    id: "transcription-002",
    title: "Podcast Transcriber",
    company: "Podscribe",
    description: "Transcribe podcast episodes for accessibility.",
    pay: "$18 per audio hour",
    requirements: "Attention to detail, English proficiency",
    posted: "May 20, 2025",
    time: "1-2 hours per episode",
    tags: ["Remote", "Flexible"],
    category: "transcription",
  },
  // Captioning
  {
    id: "captioning-001",
    title: "Video Captioner",
    company: "CaptionFlow",
    description: "Create captions for online videos and webinars.",
    pay: "$0.50-$1.00 per video minute",
    requirements: "Typing skills, English proficiency",
    posted: "May 19, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "captioning",
  },
  {
    id: "captioning-002",
    title: "Live Event Captioner",
    company: "LiveWords",
    description: "Provide real-time captions for live events.",
    pay: "$25 per event hour",
    requirements: "Fast typing, live captioning experience",
    posted: "May 21, 2025",
    time: "Event-based",
    tags: ["Remote", "Event"],
    category: "captioning",
  },
  // AI Training
  {
    id: "ai-001",
    title: "Remote AI Data Trainer",
    company: "OpenAI Tasks",
    description: "Train AI models by completing simple language tasks.",
    pay: "$10-$20 per hour",
    requirements: "Fluent English, attention to detail",
    posted: "May 18, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "ai",
  },
  {
    id: "ai-002",
    title: "Image Labeling Specialist",
    company: "VisionAI",
    description: "Label images to help train computer vision models.",
    pay: "$0.05-$0.20 per image",
    requirements: "Computer, attention to detail",
    posted: "May 20, 2025",
    time: "Flexible",
    tags: ["Remote", "No Experience"],
    category: "ai",
  },
  // Writing
  {
    id: "writing-001",
    title: "Freelance Blog Writer",
    company: "Contently",
    description: "Write blog posts on various topics for online publications.",
    pay: "$30-$100 per article",
    requirements: "Writing samples, English proficiency",
    posted: "May 19, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "writing",
  },
  {
    id: "writing-002",
    title: "Product Description Writer",
    company: "ShopText",
    description: "Write engaging product descriptions for e-commerce sites.",
    pay: "$10-$25 per description",
    requirements: "Writing skills, e-commerce experience",
    posted: "May 21, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "writing",
  },
  // Other Tasks
  {
    id: "other-001",
    title: "Online Researcher",
    company: "InfoFinders",
    description: "Conduct online research and summarize findings.",
    pay: "$12-$18 per hour",
    requirements: "Internet research skills",
    posted: "May 20, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "other",
  },
  {
    id: "other-002",
    title: "Virtual Assistant",
    company: "RemoteAssist",
    description: "Assist clients with scheduling, email, and admin tasks.",
    pay: "$15-$25 per hour",
    requirements: "Organization, communication skills",
    posted: "May 21, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "other",
  },
]

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const router = useRouter();

  // Pagination
  const jobsPerPage = 4;
  const [page, setPage] = useState(1);

  // Filter jobs by category
  const filteredJobs =
    activeTab === "all"
      ? JOBS
      : JOBS.filter((job) => job.category === activeTab);

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * jobsPerPage,
    page * jobsPerPage
  );

  const handleViewDetails = (jobId: string) => {
    const isActivated = localStorage.getItem("account_activated") === "true";
    if (isActivated) {
      router.push(`/jobs/${jobId}`);
    } else {
      setShowActivateDialog(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Available Online Jobs</h1>
      <p className="mb-6 text-gray-600">
        Browse our curated selection of legitimate online opportunities with flexible hours and minimal requirements
      </p>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`px-6 py-2 rounded transition font-medium ${
              activeTab === cat.key
                ? "bg-gray-200 text-black"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
            onClick={() => {
              setActiveTab(cat.key);
              setPage(1);
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {/* Job Cards */}
      <div className="flex flex-col gap-6">
        {paginatedJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl border p-6 shadow">
            <div className="flex flex-wrap gap-2 mb-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl font-bold">{job.title}</h2>
            <p className="text-gray-700 mb-2">{job.description}</p>
            <div className="flex flex-wrap gap-8 mb-2">
              <div>
                <div className="font-semibold text-sm">Pay Range</div>
                <div className="text-gray-700">{job.pay}</div>
              </div>
              <div>
                <div className="font-semibold text-sm">Time Commitment</div>
                <div className="text-gray-700">{job.time}</div>
              </div>
              <div>
                <div className="font-semibold text-sm">Requirements</div>
                <div className="text-gray-700">{job.requirements}</div>
              </div>
              <div>
                <div className="font-semibold text-sm">Posted</div>
                <div className="text-gray-700">{job.posted}</div>
              </div>
            </div>
            <button
              onClick={() => handleViewDetails(job.id)}
              className="mt-4 w-full bg-black text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition"
            >
              View Details & Apply <span aria-hidden>→</span>
            </button>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <button
          className="px-3 py-1 rounded bg-gray-100 text-gray-600 font-semibold disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded font-semibold ${
              page === idx + 1
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded bg-gray-100 text-gray-600 font-semibold disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
      {/* Activation Dialog */}
      {showActivateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center">
            <h2 className="text-2xl font-bold mb-2">Account Activation Required</h2>
            <p className="mb-4 text-gray-700">
              To view job details and apply for positions, a one-time account activation fee of <b>$5.00</b> is required.
            </p>
            <div className="bg-gray-50 rounded p-4 mb-4 text-left">
              <div className="font-semibold mb-2">Benefits of Account Activation:</div>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Access to all job details and application forms</li>
                <li>Apply to unlimited job opportunities</li>
                <li>Receive job alerts for new opportunities</li>
                <li>Track your applications and earnings</li>
              </ul>
            </div>
            <div className="font-semibold mb-4">One-time payment: $5.00</div>
            <a
              href="https://www.paypal.com/ncp/payment/HX5S7CVY9BQQ2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-900 transition"
            >
              Activate Account
            </a>
            <button
              onClick={() => setShowActivateDialog(false)}
              className="mt-4 block mx-auto text-sm text-blue-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
