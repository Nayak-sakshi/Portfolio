"use client";

import { useState } from "react";
import { profile } from "@/data/resume";
import Reveal from "./Reveal";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <Reveal className="contact-card">
          <p className="kicker">
            <span className="kicker-index">05</span>
            <span className="kicker-line" />
            Contact
          </p>
          <h2 className="contact-title">
            Have a system that needs <em>building</em>?
          </h2>
          <p className="contact-sub">
            I&apos;m open to backend roles and interesting distributed-systems problems. The fastest way to reach me is email.
          </p>

          <div className="contact-actions">
            <a href={`mailto:${profile.email}`} className="btn btn-primary btn-large">
              {profile.email}
            </a>
            <button className="btn btn-ghost" onClick={copy}>
              {copied ? "Copied ✓" : "Copy email"}
            </button>
          </div>

          <div className="socials">
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href={`tel:${profile.phone.replace(/-/g, "")}`}>{profile.phone}</a>
          </div>
        </Reveal>
      </div>

      <footer className="container footer">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p className="mono">Designed &amp; built with Next.js</p>
      </footer>
    </section>
  );
}
