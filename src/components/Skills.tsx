import { skills } from "@/data/resume";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const marquee = ["Node.js", "Kafka", "NestJS", "Redis", "PostgreSQL", "TypeScript", "Docker", "AWS", "Socket.io", "MongoDB", "Prisma", "Stripe", "GitHub Actions", "Express"];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading index="04" kicker="Toolkit" title={<>The <em>stack</em> I reach for.</>} />
        <div className="skills-grid">
          {skills.map((g, i) => (
            <Reveal key={g.group} delay={i * 0.06} className="card skill-card">
              <p className="mono skill-index">{String(i + 1).padStart(2, "0")}</p>
              <h3>{g.group}</h3>
              <div className="chips">
                {g.items.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i}>
              {m}
              <i>✦</i>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
