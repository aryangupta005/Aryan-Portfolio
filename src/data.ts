export const profile = {
  name: "Aryan Gupta",
  title: "Software Developer",
  subtitle: "Full-Stack · Web & Mobile",
  company: "@ Ixigo",
  tagline: "Building scalable full-stack systems and clean user experiences.",
  email: "aryangupta005@gmail.com",
  phone: "+91 9999927739",
  links: {
    github: "https://github.com/aryangupta005",
    linkedin: "https://www.linkedin.com/in/aryan-gupta",
    leetcode: "https://leetcode.com/u/aryangupta005",
    email: "mailto:aryangupta005@gmail.com",
  },
  /** Add your resume PDF URL, or put a file at public/Aryan_Resume.pdf */
  resumePdfUrl: "/Aryan_Resume.pdf",

  /**
   * Contact form → email. Get a free endpoint at https://formspree.io:
   * 1. Sign up, create a new form, add your email.
   * 2. Copy the form endpoint (e.g. https://formspree.io/f/xxxxxxxx).
   * 3. Paste it here. Submissions will be sent to your email.
   */
  contactFormEndpoint: "https://formspree.io/f/xkndpkpy",
};

export const stats = [
  { value: "5+", label: "Internships" },
  { value: "5+", label: "Projects" },
  { value: "∞", label: "Curiosity" },
  { value: "Always", label: "Learning" },
];

export const education = [
  {
    school: "Guru Gobind Singh Indraprastha University, New Delhi",
    period: "2022 – 2026",
    degree: "Bachelor of Technology in Information Technology",
    detail: "CGPA: 8.2",
  },
  {
    school: "Ryan International School, New Delhi",
    period: "2020 – 2022",
    degree: "Class XII - AISSCE",
    detail: "Percentage: 83%",
  },
  {
    school: "Ryan International School, Delhi",
    period: "2018 – 2020",
    degree: "Class X - CBSE",
    detail: "Percentage: 91.6%",
  },
];

export const experience = [
  {
    company: "Ixigo",
    logo: "/logos/ixigo-logo.png",
    role: "Software Developer Intern",
    location: "Gurugram",
    period: "January 2026 – Present",
    points: [
      "Built a full-stack JourneyFlow platform for dynamic multi-step workflows with conditional routing and session persistence.",
      "Developed a modular backend using Node.js, Express, PostgreSQL, and Prisma with reusable CRUD factory pattern and structured state management.",
      "Created a reusable React + Vite + Tailwind component library with react-hook-form and multi-theme support (Shadcn, MUI, IUI) for configurable UI rendering.",
    ],
  },
  {
    company: "Paytm",
    logo: "/logos/paytm-logo.png",
    role: "Software Developer Intern",
    location: "Noida",
    period: "June 2025 – November 2025",
    points: [
      "Learned about iOS development through the Liberty mobile app project for Puerto Rico.",
      "Designed and implemented features like Add Account and Registration using agile methodologies.",
      "Worked on bug fixes and enhancements to improve overall app stability.",
    ],
  },
  {
    company: "GAIL India Limited",
    logo: "/logos/gail-logo.png",
    role: "Cyber Security Intern",
    location: "Noida",
    period: "June 2024 – August 2024",
    points: [
      "Implemented network monitoring scripts to detect ARP cache poisoning by identifying conflicting IP-to-MAC mappings.",
      "Developed logic to detect NICs operating in promiscuous mode by sending crafted ARP packets and observing unexpected interface responses.",
      "Enabled early detection of Man-in-the-Middle attacks and passive network sniffing within LAN environments.",
    ],
  },
  {
    company: "Centre for Fire, Explosive and Environment Safety (DRDO)",
    logo: "/logos/drdo-logo.png",
    role: "Web Developer Intern",
    location: "New Delhi",
    period: "August 2023 – October 2023",
    points: [
      "Developed a secure web app for handling official documents (DAKs) in internal communication.",
      "Implemented role-based access control with multiple user tiers to secure classified access.",
      "Deployed on a DRDO intranet server, ensuring internal data privacy and control.",
    ],
  },
];

export const projects = [
  {
    name: "Split Application",
    stack: "Next.js, TypeScript, ShadCN UI, Clerk Auth, NeonDB",
    description: "Split app with Next.js 14, Clerk authentication, and NeonDB for managing group expenses. Group expense tracking, automatic balance calculation, and settlements through a responsive ShadCN UI.",
    github: "https://github.com/aryangupta005/split-app",
    live: "https://split-app-a9a9.onrender.com/",
  },
  {
    name: "Money Craft",
    stack: "React, TypeScript, Phaser, Deno, WebSocket.io, MongoDB",
    description: "2D RPG app that teaches financial literacy through gamified quests and real-life simulations. Built with React, TypeScript, Deno, and Phaser with real-time features powered by WebSocket.io. Monetized gameplay with premium zones and in-game purchases.",
    github: "https://github.com/aryangupta005/money-craft",
  },
  {
    name: "Resume Analyzer",
    stack: "Python, Gemini API, Flask",
    description: "Web-based tool to extract and analyze structured data from resumes using the Gemini API and NLP techniques. Skill-based analysis with personalized job role and certification recommendations. Interactive Flask web application for uploading resumes and displaying results.",
    github: "https://github.com/aryangupta005/resume-analyzer",
  },
];

export const skills = {
  languages: ["C", "C++", "Java", "Python", "JavaScript", "TypeScript", "SQL"],
  web: ["HTML5", "CSS3", "React.js", "Next.js", "Node.js", "Express.js"],
  tools: ["Git", "GitHub", "VS Code", "Microsoft Excel", "MySQL", "MongoDB"],
  fundamentals: ["Data Structures & Algorithms", "OOP", "DBMS", "OS"],
};
