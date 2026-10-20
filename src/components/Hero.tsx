"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/resume";
import SystemDiagram from "./SystemDiagram";

const ease = [0.22, 1, 0.36, 1] as const;
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease },
});

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-aura" aria-hidden />
      <div className="container hero-grid">
        <div>
          <motion.p className="badge" {...rise(0.1)}>
            <span className="pulse" />
            Backend Developer · {profile.location.split(",")[0]}, India
          </motion.p>

          <h1 className="hero-title">
            <motion.span className="line" {...rise(0.2)}>I build the quiet</motion.span>
            <motion.span className="line" {...rise(0.32)}>
              systems behind <em>loud</em>
            </motion.span>
            <motion.span className="line" {...rise(0.44)}>products.</motion.span>
          </h1>

          <motion.p className="hero-sub" {...rise(0.6)}>
            I&apos;m <strong>{profile.name}</strong>, a backend developer working with Node.js microservices, Kafka event pipelines
            and APIs that stay fast when traffic doesn&apos;t stay polite.
          </motion.p>

          <motion.div className="hero-actions" {...rise(0.75)}>
            <a href="#work" className="btn btn-primary">
              See my work
              <span aria-hidden>→</span>
            </a>
            <a href="#contact" className="btn btn-ghost">Get in touch</a>
          </motion.div>

          <motion.ul className="hero-meta" {...rise(0.9)}>
            <li><span className="mono">2+</span> years</li>
            <li><span className="mono">4</span> microservice modules</li>
            <li><span className="mono">20+</span> integrations shipped</li>
          </motion.ul>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease }}
        >
          <div className="window">
            <div className="window-bar">
              <span /><span /><span />
              <p className="mono">squch / event-flow</p>
            </div>
            <SystemDiagram />
            <div className="window-foot mono">
              <span><i className="ok" /> 3 consumers healthy</span>
              <span>api · &lt;200ms</span>
            </div>
          </div>
        </motion.div>
      </div>

      <a href="#about" className="scroll-cue" aria-label="Scroll to about">
        <span />
      </a>
    </section>
  );
}
