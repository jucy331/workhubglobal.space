"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch sample jobs (you can replace with actual API later)
    setJobs([
      {
        id: "1",
        title: "Remote AI Data Trainer",
        company: "OpenAI Tasks",
        description: "Train AI models by completing simple language tasks.",
      },
      {
        id: "2",
        title: "Transcription Job",
        company: "AudioText Inc.",
        description: "Transcribe audio files for various clients.",
      },
    ]);
  }, []);

  const handleViewDetails = (jobId: string) => {
    const isActivated = localStorage.getItem("account_activated") === "true";
    if (isActivated) {
      router.push(`/jobs/${jobId}`);
    } else {
      setShowActivateDialog(true);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Latest Remote Jobs</h1>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="border p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-600">{job.company}</p>
            <p className="mt-2">{job.description}</p>
            <button
              onClick={() => handleViewDetails(job.id)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Details & Apply
            </button>
          </div>
        ))}
      </div>

      {showActivateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center">
            <h2 className="text-xl font-bold mb-2">Activate Your Account</h2>
            <p className="mb-4 text-gray-700">
              Pay a one-time $5 fee to access all job details and apply.
            </p>
            <a
              href="https://www.paypal.com/ncp/payment/HX5S7CVY9BQQ2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Pay $5 on PayPal
            </a>
            <p className="text-xs text-gray-500 mt-2">
              After payment, return here and refresh the page.
            </p>
            <button
              onClick={() => setShowActivateDialog(false)}
              className="mt-4 text-sm text-blue-500 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
