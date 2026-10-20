"use client";

import { useState, type FormEvent } from "react";
import type { Profile } from "@/lib/types";
import Reveal from "./Reveal";

type Status = { kind: "idle" | "sending" | "sent" | "error"; text?: string };

export default function Contact({ profile, index }: { profile: Profile; index: string }) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      form.reset();
      setStatus({ kind: "sent", text: "Thanks! Your message is in. I'll get back to you soon." });
    } catch (err) {
      setStatus({ kind: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <Reveal className="contact-card">
          <div className="contact-grid">
            <div className="contact-intro">
              <p className="kicker">
                <span className="kicker-index">{index}</span>
                <span className="kicker-line" />
                Contact
              </p>
              <h2 className="contact-title">
                Have a system that needs <em>building</em>?
              </h2>
              <p className="contact-sub">
                I&apos;m open to backend roles and interesting distributed-systems problems. Send a note here, or email me directly.
              </p>

              <div className="contact-actions">
                <a href={`mailto:${profile.email}`} className="contact-email">{profile.email}</a>
                <button className="btn btn-ghost btn-small" onClick={copy} type="button">
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>

              <div className="socials">
                {profile.github && <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}
                {profile.phone && <a href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}>{profile.phone}</a>}
              </div>
            </div>

            <form className="contact-form" onSubmit={submit}>
              <label>
                <span>Name</span>
                <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" required minLength={10} maxLength={4000} rows={5} placeholder="What are you building?" />
              </label>
              <input name="company" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
              <button className="btn btn-primary" disabled={status.kind === "sending"}>
                {status.kind === "sending" ? "Sending…" : "Send message"}
                <span aria-hidden>→</span>
              </button>
              <p className={`form-status ${status.kind}`} role="status" aria-live="polite">
                {status.text}
              </p>
            </form>
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
