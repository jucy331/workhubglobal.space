export type JobType = "remote" | "freelance" | "part-time" | "full-time"
export type JobCategory =
  | "writing"
  | "admin"
  | "design"
  | "development"
  | "customer-support"
  | "marketing"
  | "education"
  | "other"

export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  description: string
  requirements: string[]
  type: JobType[]
  category: JobCategory
  postedAt: string
  logo: string
  url?: string
}

// Create a function to generate additional job listings
function generateAdditionalJobs(): Job[] {
  const categories: JobCategory[] = [
    "writing",
    "admin",
    "design",
    "development",
    "customer-support",
    "marketing",
    "education",
    "other",
  ]

  const types: JobType[] = ["remote", "freelance", "part-time", "full-time"]

  const companies = [
    "TechGrowth",
    "GlobalConnect",
    "ArtisticMinds",
    "DevElite",
    "CustomerFirst",
    "MarketBoost",
    "EduSphere",
    "FlexiWork",
    "CreativeJunction",
    "RemoteForce",
    "AdminPro",
    "ContentHub",
    "DesignMasters",
    "CodeCrafters",
    "SupportHub",
    "MarketWizards",
    "TechInnovate",
    "DigitalNomads",
    "RemoteWorks",
    "VirtualTeams",
    "CloudForce",
    "AITalent",
    "DataDriven",
    "CyberShield",
    "BlockchainTech",
    "FutureWorks",
  ]

  const jobTitles = {
    writing: [
      "Content Strategist",
      "Blog Writer",
      "Technical Writer",
      "Copywriter",
      "Content Editor",
      "SEO Writer",
      "Content Marketing Specialist",
      "AI Content Editor",
      "Narrative Designer",
      "UX Writer",
    ],
    admin: [
      "Executive Assistant",
      "Project Coordinator",
      "Office Manager",
      "Data Entry Specialist",
      "Administrative Assistant",
      "Virtual Assistant",
      "Operations Coordinator",
      "Team Lead",
      "Business Operations Manager",
      "Administrative Coordinator",
    ],
    design: [
      "UI Designer",
      "Graphic Designer",
      "Motion Designer",
      "Product Designer",
      "Brand Designer",
      "Illustrator",
      "UX Designer",
      "3D Artist",
      "Web Designer",
      "Design Systems Specialist",
    ],
    development: [
      "Frontend Developer",
      "Backend Engineer",
      "Full Stack Developer",
      "Mobile App Developer",
      "DevOps Engineer",
      "AI Engineer",
      "Blockchain Developer",
      "React Developer",
      "Python Developer",
      "Cloud Architect",
    ],
    "customer-support": [
      "Technical Support",
      "Customer Success Manager",
      "Help Desk Specialist",
      "Client Relations",
      "Customer Experience Lead",
      "Support Engineer",
      "Client Onboarding Specialist",
      "Customer Advocate",
      "Support Operations Manager",
      "Customer Retention Specialist",
    ],
    marketing: [
      "Digital Marketer",
      "SEO Specialist",
      "Social Media Manager",
      "Email Marketing",
      "Growth Hacker",
      "Marketing Automation Specialist",
      "Performance Marketing Manager",
      "Brand Strategist",
      "Marketing Analytics Specialist",
      "Influencer Marketing Coordinator",
    ],
    education: [
      "Online Tutor",
      "Curriculum Developer",
      "Educational Content Creator",
      "Language Teacher",
      "Course Designer",
      "E-Learning Specialist",
      "Educational Technology Consultant",
      "Virtual Classroom Facilitator",
      "Academic Coach",
      "Learning Experience Designer",
    ],
    other: [
      "Recruiter",
      "HR Specialist",
      "Financial Analyst",
      "Data Scientist",
      "Product Manager",
      "Business Analyst",
      "Legal Consultant",
      "Sustainability Coordinator",
      "Research Analyst",
      "Project Manager",
    ],
  }

  const locations = [
    "Remote (Worldwide)",
    "Remote (US Only)",
    "Remote (Europe)",
    "Remote (APAC)",
    "Remote (US Timezone)",
    "Remote (UK Timezone)",
    "Remote (LATAM)",
    "Remote (Canada)",
    "Remote (Australia)",
    "Remote (Global)",
  ]

  const salaryRanges = [
    "$20-30/hr",
    "$30-50/hr",
    "$50-80/hr",
    "$25-40/hr",
    "$60K-80K/year",
    "$80K-100K/year",
    "$100K-130K/year",
    "$130K-160K/year",
    "$160K-200K/year",
    "Competitive",
    "Based on Experience",
    "Contract",
  ]

  const descriptions = [
    "We're seeking a skilled professional to join our remote team. This role offers flexibility and the opportunity to work with a diverse, international team on exciting projects.",
    "Join our growing company and contribute to innovative solutions. We offer competitive compensation and a supportive work environment focused on your professional growth.",
    "Looking for a talented individual to help us expand our services. This position provides the perfect balance of autonomy and collaborative work.",
    "An excellent opportunity for someone looking to develop their skills while working with cutting-edge technologies and methodologies in a flexible environment.",
    "We need a dedicated professional to support our expanding operations. This role combines technical expertise with creative problem-solving in a remote setting.",
    "Our team is expanding and we're looking for a motivated professional to join us. This role offers the chance to work on impactful projects with a global reach.",
    "Seeking an experienced professional to contribute to our growing team. This position offers competitive compensation and the flexibility of remote work.",
    "Join our innovative company and be part of shaping the future of our industry. We value creativity, initiative, and a collaborative spirit.",
    "We're looking for a talented individual to help drive our success. This role offers the opportunity to work with cutting-edge tools and technologies.",
    "Our remote-first company is seeking a skilled professional to join our diverse team. This position offers work-life balance and the chance to make a real impact.",
  ]

  const requirementsBases = [
    [
      "3+ years of relevant experience",
      "Strong communication skills",
      "Self-motivated and able to work independently",
      "Reliable internet connection",
      "Proficiency with collaboration tools",
    ],
    [
      "Bachelor's degree in relevant field",
      "Proficient with required software and tools",
      "Excellent time management",
      "Portfolio of previous work",
      "Strong problem-solving abilities",
    ],
    [
      "2+ years of experience in similar role",
      "Problem-solving mindset",
      "Ability to meet deadlines",
      "Attention to detail",
      "Excellent written and verbal communication",
    ],
    [
      "Technical expertise in required areas",
      "Strong organizational skills",
      "Team player",
      "Fluent English communication",
      "Ability to work across time zones",
    ],
    [
      "5+ years of industry experience",
      "Leadership skills",
      "Strategic thinking",
      "Project management experience",
      "Ability to work in a fast-paced environment",
    ],
  ]

  const additionalJobs: Job[] = []

  // Generate 60 additional jobs
  for (let i = 0; i < 60; i++) {
    const categoryIndex = Math.floor(Math.random() * categories.length)
    const category = categories[categoryIndex]

    // Pick 1-3 job types
    const numTypes = Math.floor(Math.random() * 3) + 1
    const jobTypes: JobType[] = []
    while (jobTypes.length < numTypes) {
      const randomType = types[Math.floor(Math.random() * types.length)]
      if (!jobTypes.includes(randomType)) {
        jobTypes.push(randomType)
      }
    }

    // Pick a random job title based on category
    const titleOptions = jobTitles[category]
    const title = titleOptions[Math.floor(Math.random() * titleOptions.length)]

    // Pick a random company
    const company = companies[Math.floor(Math.random() * companies.length)]

    // Pick a random location
    const location = locations[Math.floor(Math.random() * locations.length)]

    // Pick a random salary range
    const salary = salaryRanges[Math.floor(Math.random() * salaryRanges.length)]

    // Pick a random description
    const description = descriptions[Math.floor(Math.random() * descriptions.length)]

    // Generate requirements based on a random base set, plus 1-2 job-specific requirements
    const baseReqIndex = Math.floor(Math.random() * requirementsBases.length)
    const requirements = [...requirementsBases[baseReqIndex]]

    // Add 1-2 job-specific requirements
    if (category === "writing") {
      requirements.push("Excellent writing and editing skills")
    } else if (category === "development") {
      requirements.push("Proficiency in relevant programming languages")
    } else if (category === "design") {
      requirements.push("Experience with design software (Adobe Creative Suite, Figma, etc.)")
    }

    // Generate a random date within the last 3 months of 2025
    const today = new Date()
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(today.getMonth() - 3)

    // Ensure all dates are in 2025
    const year = 2025
    const month = Math.floor(Math.random() * 5) + 1 // January to May 2025
    const day = Math.floor(Math.random() * 28) + 1 // 1-28 to avoid invalid dates

    const postedAt = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`

    additionalJobs.push({
      id: `job-${13 + i}`,
      title: title,
      company: company,
      location: location,
      salary: salary,
      description: description,
      requirements: requirements,
      type: jobTypes,
      category: category,
      postedAt: postedAt,
      logo: "/placeholder.svg?height=80&width=80",
    })
  }

  return additionalJobs
}

// Original jobs list with updated 2025 dates
export const originalJobs: Job[] = [
  {
    id: "job-001",
    title: "Remote Content Writer",
    company: "ContentCraft",
    location: "Remote (Worldwide)",
    salary: "$30-45/hr",
    description:
      "We're looking for a talented content writer to create engaging blog posts, articles, and website copy for our clients in the tech industry. The ideal candidate has experience writing about software, technology trends, and digital transformation.",
    requirements: [
      "3+ years of content writing experience",
      "Strong portfolio of published work",
      "Excellent research skills",
      "SEO knowledge",
      "Ability to meet deadlines",
      "Native or fluent English",
    ],
    type: ["remote", "freelance"],
    category: "writing",
    postedAt: "2025-05-10",
    logo: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "job-002",
    title: "Virtual Assistant (US Timezone)",
    company: "AdminPro Services",
    location: "Remote (US Timezone)",
    salary: "$20-25/hr",
    description:
      "AdminPro Services is seeking a detail-oriented virtual assistant to provide administrative support to our executive team. Tasks include email management, scheduling, travel arrangements, and basic bookkeeping.",
    requirements: [
      "2+ years of administrative experience",
      "Proficiency in Microsoft Office and Google Workspace",
      "Excellent communication skills",
      "Available during US business hours",
      "Strong organizational skills",
    ],
    type: ["remote", "part-time", "full-time"],
    category: "admin",
    postedAt: "2025-05-12",
    logo: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "job-003",
    title: "Data Entry Clerk",
    company: "DataFlow Solutions",
    location: "Remote (Worldwide)",
    salary: "$15-18/hr",
    description:
      "DataFlow Solutions is looking for accurate and efficient data entry clerks to join our remote team. Responsibilities include inputting data from various sources into our proprietary system, verifying information, and basic data cleaning.",
    requirements: [
      "Fast and accurate typing skills (minimum 50 WPM)",
      "Attention to detail",
      "Basic Excel knowledge",
      "Reliable internet connection",
      "High school diploma or equivalent",
    ],
    type: ["remote", "part-time"],
    category: "admin",
    postedAt: "2025-05-15",
    logo: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "job-004",
    title: "Social Media Assistant",
    company: "BrandBoost Marketing",
    location: "Remote (Worldwide)",
    salary: "$22-28/hr",
    description:
      "BrandBoost Marketing is seeking a creative Social Media Assistant to help manage our clients' social media presence. Responsibilities include creating and scheduling content, engaging with followers, and basic analytics reporting.",
    requirements: [
      "Experience with major social media platforms",
      "Basic graphic design skills (Canva experience preferred)",
      "Excellent writing and communication skills",
      "Understanding of social media best practices",
      "Experience with scheduling tools like Hootsuite or Buffer",
    ],
    type: ["remote", "part-time", "freelance"],
    category: "marketing",
    postedAt: "2025-05-01",
    logo: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "job-005",
    title: "Online English Tutor",
    company: "GlobalSpeak Academy",
    location: "Remote (Worldwide)",
    salary: "$18-25/hr",
    description:
      "GlobalSpeak Academy is looking for qualified English tutors to teach students of all ages and levels online. Classes are conducted via our proprietary platform, and lesson materials are provided.",
    requirements: [
      "TEFL/TESOL certification or equivalent",
      "Native or near-native English proficiency",
      "Teaching experience preferred",
      "Patient and friendly demeanor",
      "Reliable internet connection and quiet workspace",
      "Bachelor's degree in any field",
    ],
    type: ["remote", "part-time"],
    category: "education",
    postedAt: "2025-04-20",
    logo: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "job-006",
    title: "Customer Support Agent (Remote)",
    company: "TechHelp Solutions",
    location: "Remote (US/Canada)",
    salary: "$18-22/hr",
    description:
      "TechHelp Solutions is expanding our customer support team! We're looking for friendly, tech-savvy individuals to provide excellent customer service via chat, email, and phone for our SaaS clients.",
    requirements: [
      "1+ years of customer service experience",
      "Strong problem-solving skills",
      "Excellent written and verbal communication",
      "Basic technical knowledge",
      "Available for rotating shifts including some weekends",
    ],
    type: ["remote", "full-time"],
    category: "customer-support",
    postedAt: "2025-04-22",
    logo: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "job-007",
    title: "Transcriptionist (Part-time)",
    company: "AudioScribe",
    location: "Remote (Worldwide)",
    salary: "Pay per audio minute",
    description:
      "AudioScribe is seeking accurate transcriptionists to convert audio and video files to text. Work on your own schedule and get paid per completed minute of audio.",
    requirements: [
      "Excellent listening skills",
      "Fast and accurate typing (minimum 60 WPM)",
      "Strong grammar and punctuation skills",
      "Attention to detail",
      "Ability to meet deadlines",
      "Native or fluent English",
    ],
    type: ["remote", "part-time", "freelance"],
    category: "admin",
    postedAt: "2025-04-25",
    logo: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "job-008",
    title: "Freelance Graphic Designer",
    company: "DesignHub Creative",
    location: "Remote (Worldwide)",
    salary: "$30-50/hr",
    description:
      "DesignHub Creative is looking for talented graphic designers to join our freelance roster. Projects include branding, social media graphics, marketing materials, and more for a variety of clients.",
    requirements: [
      "Strong portfolio demonstrating versatile design skills",
      "Proficiency in Adobe Creative Suite",
      "Understanding of design principles and trends",
      "Ability to take feedback and iterate designs",
      "Good communication skills",
      "3+ years of design experience",
    ],
    type: ["remote", "freelance"],
    category: "design",
    postedAt: "2025-04-28",
    logo: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "job-009",
    title: "Remote Bookkeeper",
    company: "FinancePro Services",
    location: "Remote (US Only)",
    salary: "$25-35/hr",
    description:
      "FinancePro Services is seeking an experienced bookkeeper to manage financial records for our small business clients. Responsibilities include accounts payable/receivable, bank reconciliations, and financial reporting.",
    requirements: [
      "3+ years of bookkeeping experience",
      "Proficiency in QuickBooks Online",
      "Strong attention to detail",
      "Basic understanding of tax requirements",
      "Excellent organizational skills",
      "Associate's degree in accounting or equivalent experience",
    ],
    type: ["remote", "part-time", "full-time"],
    category: "admin",
    postedAt: "2025-04-30",
    logo: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "job-010",
    title: "Online Research Assistant",
    company: "ResearchPro",
    location: "Remote (Worldwide)",
    salary: "$20-25/hr",
    description:
      "ResearchPro is looking for detail-oriented research assistants to gather and compile information on various topics for our clients. Tasks include online research, data verification, and creating comprehensive reports.",
    requirements: [
      "Strong research skills",
      "Ability to evaluate source credibility",
      "Excellent written communication",
      "Proficiency in Google Suite and Microsoft Office",
      "Bachelor's degree preferred but not required",
    ],
    type: ["remote", "freelance", "part-time"],
    category: "admin",
    postedAt: "2025-05-02",
    logo: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "job-011",
    title: "Virtual HR Recruiter",
    company: "TalentSource",
    location: "Remote (US/Canada)",
    salary: "$30-40/hr",
    description:
      "TalentSource is seeking an experienced HR recruiter to help our clients find and hire top talent. Responsibilities include sourcing candidates, screening resumes, conducting initial interviews, and coordinating with hiring managers.",
    requirements: [
      "3+ years of recruiting experience",
      "Familiarity with ATS systems",
      "Strong interviewing skills",
      "Knowledge of best hiring practices",
      "Excellent communication and interpersonal skills",
      "Bachelor's degree in HR or related field preferred",
    ],
    type: ["remote", "full-time"],
    category: "admin",
    postedAt: "2025-05-05",
    logo: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "job-012",
    title: "Remote Web Tester",
    company: "QualityCheck Digital",
    location: "Remote (Worldwide)",
    salary: "$18-22/hr",
    description:
      "QualityCheck Digital needs detail-oriented web testers to evaluate websites and applications for functionality, usability, and bugs. Flexible hours and training provided.",
    requirements: [
      "Strong attention to detail",
      "Basic understanding of web technologies",
      "Ability to clearly document issues",
      "Various devices and browsers for testing",
      "Reliable internet connection",
      "Previous QA experience a plus but not required",
    ],
    type: ["remote", "part-time", "freelance"],
    category: "development",
    postedAt: "2025-05-08",
    logo: "/placeholder.svg?height=80&width=80",
  },
  // New 2025 jobs
  {
    id: "job-013",
    title: "AI Prompt Engineer",
    company: "AITalent",
    location: "Remote (Worldwide)",
    salary: "$50-70/hr",
    description:
      "AITalent is looking for skilled AI Prompt Engineers to craft effective prompts for large language models. You'll work with our clients to optimize AI interactions and develop prompt libraries for various use cases.",
    requirements: [
      "Experience with GPT-4, Claude, or similar LLMs",
      "Strong understanding of prompt engineering techniques",
      "Excellent writing and communication skills",
      "Problem-solving mindset",
      "Ability to work independently",
      "Background in NLP, linguistics, or related field a plus",
    ],
    type: ["remote", "freelance"],
    category: "writing",
    postedAt: "2025-05-14",
    logo: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "job-014",
    title: "Blockchain Developer",
    company: "BlockchainTech",
    location: "Remote (Worldwide)",
    salary: "$120K-160K/year",
    description:
      "BlockchainTech is seeking an experienced Blockchain Developer to join our team. You'll be responsible for designing, implementing, and supporting blockchain solutions for our enterprise clients.",
    requirements: [
      "3+ years of experience in blockchain development",
      "Proficiency in Solidity, Web3.js, and Ethereum",
      "Experience with smart contract development and security",
      "Strong understanding of cryptography and consensus mechanisms",
      "Knowledge of DeFi protocols and standards",
      "Computer Science degree or equivalent experience",
    ],
    type: ["remote", "full-time"],
    category: "development",
    postedAt: "2025-05-15",
    logo: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "job-015",
    title: "Virtual Reality Designer",
    company: "FutureWorks",
    location: "Remote (US Timezone)",
    salary: "$90K-120K/year",
    description:
      "FutureWorks is looking for a creative Virtual Reality Designer to join our innovative team. You'll be responsible for designing immersive VR experiences for training, education, and entertainment applications.",
    requirements: [
      "Portfolio demonstrating VR/AR design experience",
      "Proficiency with Unity or Unreal Engine",
      "3D modeling and animation skills",
      "Understanding of UX principles for immersive environments",
      "Experience with VR hardware (Oculus, Vive, etc.)",
      "Strong visual design skills",
    ],
    type: ["remote", "full-time"],
    category: "design",
    postedAt: "2025-05-12",
    logo: "/placeholder.svg?height=80&width=80",
  },
]

// Combine original jobs with additional generated jobs
const additionalJobs = generateAdditionalJobs()
export const jobs: Job[] = [...originalJobs, ...additionalJobs]
