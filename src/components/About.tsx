"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import type { Content } from "@/lib/types";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

export default function About({ profile, stats, education, now }: Pick<Content, "profile" | "stats" | "education"> & { now?: string }) {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeading index="01" kicker="About" title={<>Reliable by design, <em>calm</em> under load.</>} />

        <div className="about-grid">
          <Reveal className="about-copy">
            <p className="lead">{profile.summary}</p>
            {now && <p>{now}</p>}
            <div className="edu card">
              <p className="mono edu-tag">Education</p>
              <h3>{education.degree}</h3>
              <p className="muted">{education.school}</p>
              <div className="edu-row">
                <span>{education.period}</span>
                <span className="pill-gold">{education.score}</span>
              </div>
            </div>
          </Reveal>

          <div className="stats">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="stat card">
                <p className="stat-value">
                  <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="stat-label">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
