import type { Repo } from "@/lib/types";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const fmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });

export default function GithubRepos({ repos, profileUrl }: { repos: Repo[]; profileUrl: string }) {
  return (
    <section id="github" className="section section-tight">
      <div className="container">
        <div className="gh-head">
          <SectionHeading index="04" kicker="Live from GitHub" title={<>Recently <em>pushed</em>.</>} />
          <Reveal>
            <a href={profileUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-small">
              All repositories <span aria-hidden>↗</span>
            </a>
          </Reveal>
        </div>
        <div className="repos">
          {repos.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.05}>
              <a href={r.url} target="_blank" rel="noreferrer" className="card repo">
                <div className="repo-top">
                  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
                    <path fill="currentColor" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                  </svg>
                  <h3>{r.name}</h3>
                  <span className="repo-arrow" aria-hidden>↗</span>
                </div>
                <p className="repo-desc">{r.description || "No description yet."}</p>
                <div className="repo-meta mono">
                  {r.language && (
                    <span>
                      <i className="lang-dot" /> {r.language}
                    </span>
                  )}
                  <span>★ {r.stars}</span>
                  <span>⑂ {r.forks}</span>
                  <span className="repo-date">{fmt.format(new Date(r.updatedAt))}</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
