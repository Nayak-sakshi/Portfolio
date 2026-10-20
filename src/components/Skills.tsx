import type { SkillGroup } from "@/lib/types";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Skills({ skills, index = "04" }: { skills: SkillGroup[]; index?: string }) {
  const marquee = [...new Set(skills.flatMap((g) => g.items.slice(0, 3)))].slice(0, 16);

  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading index={index} kicker="Toolkit" title={<>The <em>stack</em> I reach for.</>} />
        <div className="skills-grid">
          {skills.map((g, i) => (
            <Reveal key={`${g.group}-${i}`} delay={i * 0.06} className="card skill-card">
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
