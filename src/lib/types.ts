import { z } from "zod";

const str = z.string().trim();
const list = z.array(str.min(1)).max(40);

export const profileSchema = z.object({
  name: str.min(1).max(80),
  role: str.min(1).max(80),
  tagline: str.max(160),
  location: str.max(120),
  email: z.string().trim().email(),
  phone: str.max(40),
  github: z.string().trim().url().or(z.literal("")),
  linkedin: z.string().trim().url().or(z.literal("")),
  summary: str.max(1200),
});

export const statSchema = z.object({
  value: z.number().finite(),
  prefix: str.max(4).optional(),
  suffix: str.max(6).optional(),
  label: str.min(1).max(80),
});

export const roleSchema = z.object({
  title: str.min(1).max(100),
  company: str.min(1).max(100),
  place: str.max(100),
  period: str.max(60),
  current: z.boolean().optional(),
  intro: str.max(400).optional(),
  points: list,
  stack: list.optional(),
});

export const projectSchema = z.object({
  name: str.min(1).max(100),
  kind: str.max(100),
  description: str.max(800),
  highlights: list,
  stack: list,
  metric: z.object({ value: str.max(16), label: str.max(60) }),
  link: z.string().trim().url().or(z.literal("")).optional(),
});

export const skillGroupSchema = z.object({ group: str.min(1).max(60), items: list });

export const educationSchema = z.object({
  degree: str.max(120),
  school: str.max(160),
  period: str.max(60),
  score: str.max(40),
});

export const contentSchema = z.object({
  profile: profileSchema,
  stats: z.array(statSchema).max(8),
  experience: z.array(roleSchema).max(20),
  projects: z.array(projectSchema).max(20),
  skills: z.array(skillGroupSchema).max(16),
  education: educationSchema,
});

export const messageSchema = z.object({
  name: str.min(1, "Please add your name").max(100),
  email: z.string().trim().email("That email doesn't look right"),
  message: str.min(10, "Message is a little short").max(4000),
  company: z.string().max(0).optional(), // honeypot: must stay empty
});

export type Profile = z.infer<typeof profileSchema>;
export type Stat = z.infer<typeof statSchema>;
export type Role = z.infer<typeof roleSchema>;
export type Project = z.infer<typeof projectSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Content = z.infer<typeof contentSchema>;

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type Repo = {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
};
