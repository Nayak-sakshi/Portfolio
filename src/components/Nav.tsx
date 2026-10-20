"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "github", label: "GitHub" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function Nav({ email, showGithub }: { email: string; showGithub: boolean }) {
  const items = useMemo(() => (showGithub ? links : links.filter((l) => l.id !== "github")), [showGithub]);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    items.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [items]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="container nav-inner">
        <a href="#top" className="logo" aria-label="Back to top">
          <span className="logo-mark">SN</span>
          <span className="logo-text">Sakshi Nayak</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {items.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? "active" : ""}>
              {active === l.id && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span>{l.label}</span>
            </a>
          ))}
        </nav>

        <a href={`mailto:${email}`} className="btn btn-ghost btn-small nav-cta">Let&apos;s talk</a>

        <button className={`burger ${open ? "open" : ""}`} onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {items.map((l, i) => (
              <motion.a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i + 0.1 }}
              >
                <span className="mono">0{i + 1}</span>
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
