"use client";

import type { PointerEvent } from "react";
import type { Project } from "@/lib/types";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

function track(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className="section">
      <div className="container">
        <SectionHeading index="03" kicker="Selected work" title={<>Systems I&apos;ve <em>built</em>.</>} />

        <div className="projects">
          {projects.map((p, i) => (
            <Reveal key={`${p.name}-${i}`} delay={i * 0.08} className={`project-wrap ${i === 0 ? "featured" : ""}`}>
              <article className="project" onPointerMove={track}>
                <div className="project-top">
                  <p className="mono muted">{String(i + 1).padStart(2, "0")} / {p.kind}</p>
                  <div className="metric">
                    <span className="metric-value">{p.metric.value}</span>
                    <span className="metric-label">{p.metric.label}</span>
                  </div>
                </div>
                <h3 className="project-name">
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noreferrer" className="project-link">
                      {p.name}
                      <span aria-hidden>↗</span>
                    </a>
                  ) : (
                    p.name
                  )}
                </h3>
                <p className="project-desc">{p.description}</p>
                <ul className="ticks">
                  {p.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <div className="project-foot">
                  <div className="chips">
                    {p.stack.map((s) => (
                      <span key={s} className="chip">{s}</span>
                    ))}
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer" className="btn btn-ghost btn-small">
                      <i className="live-dot" /> View live
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
