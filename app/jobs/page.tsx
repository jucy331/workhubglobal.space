import React, { useState, useEffect } from "react";
import { BadgeCheck, Clock, DollarSign, FileText } from "lucide-react";

const jobData = [
  {
    id: 1,
    title: "Product Survey Tester",
    description:
      "Share your opinions on new products and services through our detailed survey platform.",
    pay: "$2–$45 per survey",
    time: "5–30 minutes per survey",
    requirements: "Internet access, basic computer skills",
    tags: ["Flexible", "No Experience"],
    posted: "May 18, 2025",
    category: "Surveys",
  },
  {
    id: 2,
    title: "Audio Transcription Specialist",
    description:
      "Convert audio files to text. Requires attention to detail and strong typing skills.",
    pay: "$10–$40 per audio hour",
    time: "Varies per project",
    requirements: "Excellent English, transcription software knowledge",
    tags: ["Remote", "Flexible Hours"],
    posted: "May 18, 2025",
    category: "Transcription",
  },
  {
    id: 3,
    title: "AI Training Contributor",
    description:
      "Help train AI by performing simple data labeling tasks and answering prompts.",
    pay: "$5–$25 per task",
    time: "10–60 minutes per task",
    requirements: "Fluent English, good reading comprehension",
    tags: ["Remote", "Beginner Friendly"],
    posted: "May 18, 2025",
    category: "AI Training",
  },
  {
    id: 4,
    title: "Captioning Freelancer",
    description:
      "Write captions for online videos and meetings. Great opportunity for fast typists.",
    pay: "$0.50–$2 per minute of video",
    time: "Depends on video length",
    requirements: "Fast typing, attention to detail",
    tags: ["Remote", "Flexible Hours"],
    posted: "May 18, 2025",
    category: "Captioning",
  },
  {
    id: 5,
    title: "Freelance Content Writer",
    description:
      "Write articles, blog posts, and product descriptions for clients worldwide.",
    pay: "$15–$100 per article",
    time: "1–3 hours per piece",
    requirements: "Strong writing skills, research ability",
    tags: ["Remote", "Flexible", "Experienced"],
    posted: "May 18, 2025",
    category: "Writing",
  },
  {
    id: 6,
    title: "Survey Panelist (International)",
    description:
      "Participate in market research surveys and get paid for your opinion.",
    pay: "$1–$20 per survey",
    time: "2–20 minutes per survey",
    requirements: "Smartphone or computer, basic English",
    tags: ["Flexible", "Easy Work"],
    posted: "May 18, 2025",
    category: "Surveys",
  },
];

export default jobData;
