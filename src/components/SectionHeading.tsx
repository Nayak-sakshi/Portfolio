import Reveal from "./Reveal";

export default function SectionHeading({ index, kicker, title }: { index: string; kicker: string; title: React.ReactNode }) {
  return (
    <Reveal className="section-heading">
      <p className="kicker">
        <span className="kicker-index">{index}</span>
        <span className="kicker-line" />
        {kicker}
      </p>
      <h2>{title}</h2>
    </Reveal>
  );
}
