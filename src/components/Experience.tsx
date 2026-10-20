"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import type { Role } from "@/lib/types";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Experience({ experience }: { experience: Role[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHeading index="02" kicker="Experience" title={<>Where I&apos;ve been <em>shipping</em>.</>} />

        <div className="timeline" ref={ref}>
          <div className="timeline-track" aria-hidden>
            <motion.div className="timeline-fill" style={{ scaleY }} />
          </div>

          {experience.map((job, i) => (
            <Reveal key={`${job.company}-${i}`} delay={0.05} className="tl-item">
              <span className={`tl-dot ${job.current ? "current" : ""}`} aria-hidden />
              <div className="tl-head">
                <p className="mono tl-period">{job.period}</p>
                {job.current && <span className="pill-gold">Current</span>}
              </div>
              <div className="card tl-card">
                <div className="tl-title">
                  <h3>{job.title}</h3>
                  <p>
                    <span className="gold">{job.company}</span>
                    <span className="muted"> · {job.place}</span>
                  </p>
                </div>
                {job.intro && <p className="tl-intro">{job.intro}</p>}
                <ul className="ticks">
                  {job.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                {job.stack && (
                  <div className="chips">
                    {job.stack.map((s) => (
                      <span key={s} className="chip">{s}</span>
                    ))}
                  </div>
                )}
                <span className="tl-num mono" aria-hidden>0{i + 1}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
