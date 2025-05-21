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

// Add at least 50 jobs (10 per category) for demonstration
const JOBS: Job[] = [
  // --- Surveys (10) ---
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
  {
    id: "survey-004",
    title: "Brand Awareness Surveyor",
    company: "BrandScope",
    description: "Help brands measure their reach by answering simple surveys.",
    pay: "$2-$8 per survey",
    requirements: "Internet access",
    posted: "May 21, 2025",
    time: "5-15 minutes per survey",
    tags: ["Remote", "Flexible"],
    category: "surveys",
  },
  {
    id: "survey-005",
    title: "Market Research Panelist",
    company: "MarketMinds",
    description: "Join our market research panel and influence new products.",
    pay: "$4-$12 per survey",
    requirements: "Internet access, basic English",
    posted: "May 22, 2025",
    time: "10-30 minutes per survey",
    tags: ["Flexible", "Remote"],
    category: "surveys",
  },
  {
    id: "survey-006",
    title: "Online Poll Participant",
    company: "QuickPoll",
    description: "Participate in quick online polls and earn rewards.",
    pay: "$1-$3 per poll",
    requirements: "Internet access",
    posted: "May 23, 2025",
    time: "2-5 minutes per poll",
    tags: ["Flexible", "No Experience"],
    category: "surveys",
  },
  {
    id: "survey-007",
    title: "Product Feedback Reviewer",
    company: "FeedbackLoop",
    description: "Review products and provide feedback for improvement.",
    pay: "$5-$15 per review",
    requirements: "Internet access, attention to detail",
    posted: "May 24, 2025",
    time: "10-20 minutes per review",
    tags: ["Remote", "Flexible"],
    category: "surveys",
  },
  {
    id: "survey-008",
    title: "Lifestyle Survey Taker",
    company: "LifeSurveys",
    description: "Answer lifestyle surveys and help shape future trends.",
    pay: "$3-$10 per survey",
    requirements: "Internet access",
    posted: "May 25, 2025",
    time: "10-15 minutes per survey",
    tags: ["Flexible", "Remote"],
    category: "surveys",
  },
  {
    id: "survey-009",
    title: "Healthcare Survey Panelist",
    company: "HealthPanel",
    description: "Share your healthcare experiences in confidential surveys.",
    pay: "$6-$18 per survey",
    requirements: "Internet access, 18+ years old",
    posted: "May 26, 2025",
    time: "15-30 minutes per survey",
    tags: ["Flexible", "Remote"],
    category: "surveys",
  },
  {
    id: "survey-010",
    title: "Education Survey Contributor",
    company: "EduVoice",
    description: "Help improve education by participating in surveys.",
    pay: "$4-$12 per survey",
    requirements: "Internet access, student or parent",
    posted: "May 27, 2025",
    time: "10-20 minutes per survey",
    tags: ["Flexible", "Remote"],
    category: "surveys",
  },
  // --- Transcription (10) ---
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
  {
    id: "transcription-003",
    title: "Medical Transcriptionist",
    company: "MediTrans",
    description: "Transcribe medical dictations for clinics and hospitals.",
    pay: "$20-$30 per audio hour",
    requirements: "Medical terminology knowledge",
    posted: "May 21, 2025",
    time: "Varies by assignment",
    tags: ["Remote", "Specialized"],
    category: "transcription",
  },
  {
    id: "transcription-004",
    title: "Legal Transcriptionist",
    company: "LegalDocs",
    description: "Transcribe legal proceedings and interviews.",
    pay: "$22-$35 per audio hour",
    requirements: "Legal terminology knowledge",
    posted: "May 22, 2025",
    time: "Varies by project",
    tags: ["Remote", "Specialized"],
    category: "transcription",
  },
  {
    id: "transcription-005",
    title: "General Transcriptionist",
    company: "Transcripto",
    description: "Transcribe a variety of audio content.",
    pay: "$12-$20 per audio hour",
    requirements: "Typing skills, attention to detail",
    posted: "May 23, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "transcription",
  },
  {
    id: "transcription-006",
    title: "Focus Group Transcriber",
    company: "FocusTrans",
    description: "Transcribe focus group discussions.",
    pay: "$18-$28 per audio hour",
    requirements: "Good listening skills",
    posted: "May 24, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "transcription",
  },
  {
    id: "transcription-007",
    title: "Academic Transcriptionist",
    company: "EduTrans",
    description: "Transcribe academic lectures and interviews.",
    pay: "$15-$22 per audio hour",
    requirements: "English proficiency",
    posted: "May 25, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "transcription",
  },
  {
    id: "transcription-008",
    title: "Business Meeting Transcriber",
    company: "BizTrans",
    description: "Transcribe business meetings and conference calls.",
    pay: "$16-$24 per audio hour",
    requirements: "Typing skills, confidentiality",
    posted: "May 26, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "transcription",
  },
  {
    id: "transcription-009",
    title: "Interview Transcriber",
    company: "InterTrans",
    description: "Transcribe interviews for research and journalism.",
    pay: "$14-$20 per audio hour",
    requirements: "Typing skills, attention to detail",
    posted: "May 27, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "transcription",
  },
  {
    id: "transcription-010",
    title: "Video Transcriptionist",
    company: "VidTrans",
    description: "Transcribe video content for subtitles.",
    pay: "$15-$22 per video hour",
    requirements: "Typing skills, English proficiency",
    posted: "May 28, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "transcription",
  },
  // --- Captioning (10) ---
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
  {
    id: "captioning-003",
    title: "TV Show Captioner",
    company: "TVText",
    description: "Caption TV shows for accessibility.",
    pay: "$1.20 per video minute",
    requirements: "Typing skills, English proficiency",
    posted: "May 22, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "captioning",
  },
  {
    id: "captioning-004",
    title: "YouTube Captioner",
    company: "YTSubs",
    description: "Create captions for YouTube creators.",
    pay: "$0.80-$1.10 per video minute",
    requirements: "Typing skills, English proficiency",
    posted: "May 23, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "captioning",
  },
  {
    id: "captioning-005",
    title: "Corporate Webinar Captioner",
    company: "WebiCap",
    description: "Caption corporate webinars and online meetings.",
    pay: "$1.00 per video minute",
    requirements: "Typing skills, confidentiality",
    posted: "May 24, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "captioning",
  },
  {
    id: "captioning-006",
    title: "Educational Video Captioner",
    company: "EduCap",
    description: "Caption educational videos for e-learning platforms.",
    pay: "$0.90 per video minute",
    requirements: "Typing skills, English proficiency",
    posted: "May 25, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "captioning",
  },
  {
    id: "captioning-007",
    title: "Movie Captioner",
    company: "MovieSubs",
    description: "Create captions for movies and documentaries.",
    pay: "$1.50 per video minute",
    requirements: "Typing skills, English proficiency",
    posted: "May 26, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "captioning",
  },
  {
    id: "captioning-008",
    title: "Conference Captioner",
    company: "ConfCap",
    description: "Provide captions for online conferences.",
    pay: "$1.10 per video minute",
    requirements: "Typing skills, English proficiency",
    posted: "May 27, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "captioning",
  },
  {
    id: "captioning-009",
    title: "Podcast Captioner",
    company: "PodCap",
    description: "Create captions for podcast videos.",
    pay: "$0.70 per video minute",
    requirements: "Typing skills, English proficiency",
    posted: "May 28, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "captioning",
  },
  {
    id: "captioning-010",
    title: "Social Media Video Captioner",
    company: "SocCap",
    description: "Caption short social media videos.",
    pay: "$0.60 per video minute",
    requirements: "Typing skills, English proficiency",
    posted: "May 29, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "captioning",
  },
  // --- AI Training (10) ---
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
  {
    id: "ai-003",
    title: "Chatbot Conversation Rater",
    company: "BotCheck",
    description: "Rate chatbot conversations for quality and accuracy.",
    pay: "$8-$15 per hour",
    requirements: "Fluent English, internet access",
    posted: "May 21, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "ai",
  },
  {
    id: "ai-004",
    title: "Speech Data Collector",
    company: "VoiceAI",
    description: "Record and submit speech samples for AI training.",
    pay: "$5-$20 per task",
    requirements: "Microphone, clear speech",
    posted: "May 22, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "ai",
  },
  {
    id: "ai-005",
    title: "Text Categorization Tasker",
    company: "TextAI",
    description: "Categorize text samples for machine learning.",
    pay: "$0.02-$0.10 per sample",
    requirements: "Computer, attention to detail",
    posted: "May 23, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "ai",
  },
  {
    id: "ai-006",
    title: "Sentiment Analysis Annotator",
    company: "SentimentLab",
    description: "Label text for sentiment analysis datasets.",
    pay: "$0.03-$0.12 per sample",
    requirements: "Computer, English proficiency",
    posted: "May 24, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "ai",
  },
  {
    id: "ai-007",
    title: "Data Validation Worker",
    company: "DataCheck",
    description: "Validate AI training data for accuracy.",
    pay: "$9-$16 per hour",
    requirements: "Attention to detail",
    posted: "May 25, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "ai",
  },
  {
    id: "ai-008",
    title: "Audio Tagging Specialist",
    company: "AudioAI",
    description: "Tag audio clips for machine learning.",
    pay: "$0.04-$0.15 per clip",
    requirements: "Computer, headphones",
    posted: "May 26, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "ai",
  },
  {
    id: "ai-009",
    title: "Image Quality Rater",
    company: "PicRate",
    description: "Rate images for quality and relevance.",
    pay: "$0.03-$0.10 per image",
    requirements: "Computer, attention to detail",
    posted: "May 27, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "ai",
  },
  {
    id: "ai-010",
    title: "AI Prompt Tester",
    company: "PromptLab",
    description: "Test and evaluate AI-generated prompts.",
    pay: "$10-$18 per hour",
    requirements: "Fluent English, internet access",
    posted: "May 28, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "ai",
  },
  // --- Writing (10) ---
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
  {
    id: "writing-003",
    title: "SEO Content Writer",
    company: "RankWriters",
    description: "Write SEO-optimized articles for websites.",
    pay: "$25-$80 per article",
    requirements: "SEO knowledge, writing samples",
    posted: "May 22, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "writing",
  },
  {
    id: "writing-004",
    title: "Technical Writer",
    company: "TechDocs",
    description: "Write technical documentation for software products.",
    pay: "$40-$120 per document",
    requirements: "Technical background, writing samples",
    posted: "May 23, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "writing",
  },
  {
    id: "writing-005",
    title: "Copywriter",
    company: "CopyPro",
    description: "Write marketing copy for ads and landing pages.",
    pay: "$20-$60 per copy",
    requirements: "Writing skills, marketing experience",
    posted: "May 24, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "writing",
  },
  {
    id: "writing-006",
    title: "Grant Writer",
    company: "GrantMakers",
    description: "Write grant proposals for nonprofits.",
    pay: "$50-$200 per proposal",
    requirements: "Grant writing experience",
    posted: "May 25, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "writing",
  },
  {
    id: "writing-007",
    title: "Resume Writer",
    company: "CareerDocs",
    description: "Write and edit resumes for job seekers.",
    pay: "$15-$40 per resume",
    requirements: "Writing skills, HR experience",
    posted: "May 26, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "writing",
  },
  {
    id: "writing-008",
    title: "Social Media Content Writer",
    company: "SocialBuzz",
    description: "Write posts and captions for social media brands.",
    pay: "$10-$30 per post",
    requirements: "Writing skills, social media experience",
    posted: "May 27, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "writing",
  },
  {
    id: "writing-009",
    title: "Script Writer",
    company: "ScriptWorks",
    description: "Write scripts for YouTube and podcasts.",
    pay: "$25-$70 per script",
    requirements: "Writing skills, creativity",
    posted: "May 28, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "writing",
  },
  {
    id: "writing-010",
    title: "Newsletter Writer",
    company: "NewsMail",
    description: "Write and edit newsletters for organizations.",
    pay: "$20-$50 per newsletter",
    requirements: "Writing skills, editing experience",
    posted: "May 29, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "writing",
  },
  // --- Other Tasks (10) ---
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
  {
    id: "other-003",
    title: "Data Entry Clerk",
    company: "DataWorks",
    description: "Enter and manage data for various clients.",
    pay: "$10-$16 per hour",
    requirements: "Typing skills, attention to detail",
    posted: "May 22, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "other",
  },
  {
    id: "other-004",
    title: "Customer Support Agent",
    company: "HelpDesk",
    description: "Provide customer support via chat and email.",
    pay: "$13-$20 per hour",
    requirements: "Communication skills, patience",
    posted: "May 23, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "other",
  },
  {
    id: "other-005",
    title: "Online Tutor",
    company: "TutorNow",
    description: "Tutor students in various subjects online.",
    pay: "$15-$30 per hour",
    requirements: "Subject expertise, teaching skills",
    posted: "May 24, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "other",
  },
  {
    id: "other-006",
    title: "Survey Moderator",
    company: "SurveySafe",
    description: "Moderate online surveys for quality and compliance.",
    pay: "$12-$18 per hour",
    requirements: "Attention to detail",
    posted: "May 25, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "other",
  },
  {
    id: "other-007",
    title: "Remote Scheduler",
    company: "Schedulr",
    description: "Manage appointments and calendars for clients.",
    pay: "$14-$22 per hour",
    requirements: "Organization, communication skills",
    posted: "May 26, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "other",
  },
  {
    id: "other-008",
    title: "Online Community Moderator",
    company: "ForumGuard",
    description: "Moderate online forums and communities.",
    pay: "$11-$17 per hour",
    requirements: "Communication skills, patience",
    posted: "May 27, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "other",
  },
  {
    id: "other-009",
    title: "Remote Tester",
    company: "TestLab",
    description: "Test websites and apps for usability.",
    pay: "$10-$20 per test",
    requirements: "Internet access, attention to detail",
    posted: "May 28, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "other",
  },
  {
    id: "other-010",
    title: "Online Mystery Shopper",
    company: "ShopCheck",
    description: "Shop online and provide feedback on your experience.",
    pay: "$8-$25 per shop",
    requirements: "Internet access, attention to detail",
    posted: "May 29, 2025",
    time: "Flexible",
    tags: ["Remote", "Flexible"],
    category: "other",
  },
];

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const router = useRouter();

  // Pagination
  const jobsPerPage = 10;
  const [page, setPage] = useState(1);

  // Jobs state for refreshing
  const [jobs, setJobs] = useState<Job[]>(JOBS);

  // Refresh jobs every 3 minutes (180000 ms)
  useEffect(() => {
    const refreshJobs = () => {
      // Simulate fetching new jobs (replace with API call if needed)
      setJobs([...JOBS]);
    };
    const interval = setInterval(refreshJobs, 180000);
    return () => clearInterval(interval);
  }, []);

  // Filter jobs by category
  const filteredJobs =
    activeTab === "all"
      ? jobs
      : jobs.filter((job) => job.category === activeTab);

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
