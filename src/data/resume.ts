import type { Content, Education, Profile, Project, Role, SkillGroup, Stat } from "@/lib/types";

export const profile: Profile = {
  name: "Sakshi Nayak",
  role: "Backend Developer",
  tagline: "Node.js · Microservices · Kafka · Distributed Systems",
  location: "Indore, Madhya Pradesh, India",
  email: "nayaksakshi442@gmail.com",
  phone: "+91-7389070250",
  github: "https://github.com/Nayak-sakshi",
  linkedin: "https://www.linkedin.com/in/sakshiinayak/",
  summary:
    "Backend developer with 2+ years of experience building Node.js microservices, REST APIs and event-driven systems. I like the parts of software nobody sees: queues that never drop a message, caches that keep databases calm, and APIs that answer before you notice they were asked.",
};

export const stats: Stat[] = [
  { value: 2, suffix: "+", label: "Years building backends" },
  { value: 40, prefix: "~", suffix: "%", label: "DB load cut with Redis caching" },
  { value: 60, suffix: "+", label: "NestJS REST endpoints designed" },
  { value: 200, prefix: "<", suffix: "ms", label: "API responses, down from ~1 s" },
];

export const experience: Role[] = [
  {
    title: "Backend Developer",
    company: "Cyber Infrastructure",
    place: "Indore, MP",
    period: "Feb 2026 — Present",
    current: true,
    intro: "Building the backends of Squch, a 4-module super app, and Projetos a La Carte, a construction lead marketplace.",
    points: [
      "Built separate Node.js microservices for food delivery, services, bus booking and stays.",
      "Connected order, payment and notification services through Kafka with partitioned topics and dead-letter retries.",
      "Designed 60+ NestJS endpoints on a 25+ table PostgreSQL/Prisma schema with JWT, Google login and 3-role RBAC.",
      "Moved emails, notifications and payment events to Redis-backed queues, taking responses from ~1 s to under 200 ms.",
      "Shipped with Docker, GitHub Actions and AWS, cutting releases to ~10 minutes.",
    ],
    stack: ["Node.js", "NestJS", "Kafka", "Redis", "PostgreSQL", "AWS"],
  },
  {
    title: "Software Developer",
    company: "Walkover Web Solutions",
    place: "Indore, MP",
    period: "Aug 2024 — Feb 2026",
    points: [
      "Implemented 20+ integration plugins for the viaSocket automation platform, connecting CRMs, email and forms.",
      "Integrated webhook and polling triggers, cutting workflow run time by ~20%; helped launch 15+ app listings.",
      "Owned production support: debugged failing workflows from logs, added retries and clearer error messages.",
    ],
    stack: ["Node.js", "REST APIs", "Webhooks", "JavaScript"],
  },
  {
    title: "Web Development Intern ×3",
    company: "CodeAlpha & others",
    place: "Remote",
    period: "2023 — 2024",
    points: [
      "Built a full website at CodeAlpha with HTML/CSS/JS on a Node.js, Express and MongoDB backend.",
      "Built sign-up/login and data-management REST APIs, tested in Postman, versioned with Git.",
    ],
    stack: ["Express", "MongoDB", "JavaScript"],
  },
];

export const projects: Project[] = [
  {
    name: "Squch",
    kind: "Multipurpose super app",
    description:
      "One app, four businesses: food delivery, home services, bus booking and stays, each running as its own Node.js microservice and talking through Kafka.",
    highlights: [
      "Kafka event backbone with partitioned topics and dead-letter retries",
      "Real-time order tracking over Socket.io, replacing client polling",
      "Redis caching layer in front of MySQL and MongoDB",
      "CI/CD to AWS EC2 via GitHub Actions, monitored with CloudWatch",
    ],
    stack: ["Node.js", "Express", "Kafka", "Redis", "MySQL", "MongoDB", "Socket.io", "AWS"],
    metric: { value: "~40%", label: "less database load" },
  },
  {
    name: "Projetos a La Carte",
    kind: "Construction lead marketplace",
    description:
      "Clients post their construction needs for free; professionals subscribe to unlock leads. I built the backend end to end, from schema to deployment.",
    highlights: [
      "60+ REST endpoints over a 25+ table PostgreSQL schema with Prisma",
      "JWT + Google OAuth, Client/Professional/Admin RBAC, rate limiting, EN/PT",
      "Stripe subscriptions with signature-verified, idempotent webhooks",
      "Redis-backed job queues and Firebase push notifications",
    ],
    stack: ["NestJS", "PostgreSQL", "Prisma", "Redis", "Stripe", "Firebase", "Docker", "AWS"],
    metric: { value: "<200ms", label: "API response time" },
  },
  {
    name: "URL Shortener",
    kind: "Personal project · Live",
    description:
      "A full-stack URL shortener built to practise system design: shorten a link (generated code or custom ending, optional expiry), share it, and watch the clicks come in.",
    highlights: [
      "Redirects served from a Redis cache, with MongoDB as the fallback",
      "Click tracking buffered in Redis and batch-written to MongoDB every minute",
      "Per-route rate limiting with fixed-window and sliding-window strategies",
      "JWT accounts, dashboard totals and per-link 7-day analytics",
      "CI builds the production Docker image and pushes it to Docker Hub",
    ],
    stack: ["Node.js", "Express 5", "MongoDB", "Redis", "JWT", "React 19", "Vite", "Docker"],
    metric: { value: "Live", label: "on Vercel" },
    link: "https://url-shortener-iota-opal.vercel.app/",
  },
  {
    name: "viaSocket Integrations",
    kind: "Workflow automation platform",
    description:
      "Plugins that let viaSocket users wire CRMs, email tools and forms into automated workflows, plus the triggers that start them.",
    highlights: [
      "20+ integration plugins across CRMs, email and form tools",
      "Webhook and polling triggers that cut workflow run time ~20%",
      "Retries and clearer error messages from production debugging",
    ],
    stack: ["Node.js", "JavaScript", "REST APIs", "Webhooks"],
    metric: { value: "15+", label: "app listings launched" },
  },
];

export const skills: SkillGroup[] = [
  { group: "Backend & Architecture", items: ["Node.js", "REST APIs", "Microservices", "Event-Driven Architecture", "System Design", "Socket.io"] },
  { group: "Messaging & Streaming", items: ["Apache Kafka", "Consumer Groups", "Dead-Letter Queues", "Job Queues", "Redis Pub/Sub", "Webhooks"] },
  { group: "Languages & Frameworks", items: ["TypeScript", "JavaScript", "Python", "C++", "Express.js", "NestJS"] },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma", "Sequelize", "Query Optimization"] },
  { group: "Cloud & DevOps", items: ["AWS EC2", "S3", "Lambda", "CloudWatch", "Docker", "GitHub Actions"] },
  { group: "Security & Auth", items: ["JWT", "Google OAuth", "RBAC", "Rate Limiting", "Input Validation"] },
];

export const education: Education = {
  degree: "B.Tech, Computer Science & Engineering",
  school: "Bansal Institute of Science and Technology, Bhopal",
  period: "2019 — 2023",
  score: "CGPA 8.79",
};

export const defaultContent: Content = { profile, stats, experience, projects, skills, education };
