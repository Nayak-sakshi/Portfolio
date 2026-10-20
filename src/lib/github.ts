import type { Repo } from "./types";

type GhRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

export async function getRepos(profileUrl: string, count = 6): Promise<Repo[]> {
  const user = profileUrl.match(/github\.com\/([^/?#]+)/i)?.[1];
  if (!user) return [];
  try {
    const res = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=30`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const repos = (await res.json()) as GhRepo[];
    return repos
      .filter((r) => !r.fork && !r.archived)
      .slice(0, count)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        updatedAt: r.pushed_at,
      }));
  } catch {
    return [];
  }
}
