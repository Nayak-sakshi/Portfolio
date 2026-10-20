"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Content, Message, Project, Role, SkillGroup, Stat } from "@/lib/types";
import { Area, ListEditor, ListText, Text, Toggle } from "./fields";

const tabs = ["Profile", "Stats", "Experience", "Projects", "Skills", "Education", "Messages"] as const;
type Tab = (typeof tabs)[number];

export default function Admin() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Profile");
  const [content, setContent] = useState<Content | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [toast, setToast] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [version, setVersion] = useState(0); // remounts editors after a discard

  const load = useCallback(async () => {
    const [c, m] = await Promise.all([fetch("/api/admin/content"), fetch("/api/admin/messages")]);
    if (c.status === 401) return router.replace("/admin/login");
    const data = (await c.json()) as Content;
    setContent(data);
    setSaved(JSON.stringify(data));
    if (m.ok) setMessages(await m.json());
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(() => content !== null && JSON.stringify(content) !== saved, [content, saved]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => dirty && e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const flash = (kind: "ok" | "error", text: string) => {
    setToast({ kind, text });
    setTimeout(() => setToast(null), 3500);
  };

  const save = async () => {
    if (!content) return;
    setSaving(true);
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (res.status === 401) return router.replace("/admin/login");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return flash("error", data.error || "Save failed");
    setSaved(JSON.stringify(content));
    flash("ok", "Saved. Your site is updated.");
  };

  const discard = () => {
    setContent(JSON.parse(saved));
    setVersion((v) => v + 1);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  const setMsg = async (id: string, action: "read" | "unread" | "delete") => {
    if (action === "delete") {
      if (!confirm("Delete this message?")) return;
      await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      setMessages((ms) => ms.filter((m) => m.id !== id));
    } else {
      await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: action === "read" }),
      });
      setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, read: action === "read" } : m)));
    }
  };

  if (!content) return <div className="admin-loading">Loading…</div>;

  const set = <K extends keyof Content>(key: K, value: Content[K]) => setContent({ ...content, [key]: value });
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="shell">
      <aside className="side">
        <Link href="/" className="side-brand" target="_blank" rel="noreferrer">
          <span className="logo-mark">SN</span>
          <span>
            Portfolio admin
            <small>View site ↗</small>
          </span>
        </Link>
        <nav>
          {tabs.map((t) => (
            <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
              {t}
              {t === "Messages" && unread > 0 && <b>{unread}</b>}
            </button>
          ))}
        </nav>
        <button className="logout" onClick={logout}>Sign out</button>
      </aside>

      <section className="panel" key={version}>
        <header className="panel-head">
          <div>
            <p className="mono muted">Editing</p>
            <h1>{tab}</h1>
          </div>
          {tab !== "Messages" && (
            <div className="panel-actions">
              {dirty && <span className="dirty">Unsaved changes</span>}
              <button className="btn btn-ghost btn-small" onClick={discard} disabled={!dirty}>Discard</button>
              <button className="btn btn-primary btn-small" onClick={save} disabled={!dirty || saving}>
                {saving ? "Saving…" : "Save & publish"}
              </button>
            </div>
          )}
        </header>

        {tab === "Profile" && (
          <div className="grid2">
            <Text label="Name" value={content.profile.name} onChange={(v) => set("profile", { ...content.profile, name: v })} />
            <Text label="Role" value={content.profile.role} onChange={(v) => set("profile", { ...content.profile, role: v })} />
            <Text label="Tagline" hint="Separate focus areas with ·" value={content.profile.tagline} onChange={(v) => set("profile", { ...content.profile, tagline: v })} />
            <Text label="Location" value={content.profile.location} onChange={(v) => set("profile", { ...content.profile, location: v })} />
            <Text label="Email" type="email" value={content.profile.email} onChange={(v) => set("profile", { ...content.profile, email: v })} />
            <Text label="Phone" value={content.profile.phone} onChange={(v) => set("profile", { ...content.profile, phone: v })} />
            <Text label="GitHub URL" hint="Also powers the live GitHub section" value={content.profile.github} onChange={(v) => set("profile", { ...content.profile, github: v })} />
            <Text label="LinkedIn URL" value={content.profile.linkedin} onChange={(v) => set("profile", { ...content.profile, linkedin: v })} />
            <div className="span2">
              <Area label="Summary" rows={5} value={content.profile.summary} onChange={(v) => set("profile", { ...content.profile, summary: v })} />
            </div>
          </div>
        )}

        {tab === "Stats" && (
          <ListEditor<Stat>
            items={content.stats}
            onChange={(v) => set("stats", v)}
            title={(s) => `${s.prefix ?? ""}${s.value}${s.suffix ?? ""} · ${s.label}`}
            make={() => ({ value: 0, label: "New stat" })}
            addLabel="Add stat"
            render={(s, upd) => (
              <div className="grid4">
                <Text label="Prefix" value={s.prefix ?? ""} onChange={(v) => upd({ prefix: v || undefined })} />
                <Text label="Number" type="number" value={String(s.value)} onChange={(v) => upd({ value: Number(v) || 0 })} />
                <Text label="Suffix" value={s.suffix ?? ""} onChange={(v) => upd({ suffix: v || undefined })} />
                <Text label="Label" value={s.label} onChange={(v) => upd({ label: v })} />
              </div>
            )}
          />
        )}

        {tab === "Experience" && (
          <ListEditor<Role>
            items={content.experience}
            onChange={(v) => set("experience", v)}
            title={(r) => `${r.title} · ${r.company}`}
            make={() => ({ title: "New role", company: "Company", place: "", period: "", points: [], stack: [] })}
            addLabel="Add role"
            render={(r, upd) => (
              <div className="grid2">
                <Text label="Title" value={r.title} onChange={(v) => upd({ title: v })} />
                <Text label="Company" value={r.company} onChange={(v) => upd({ company: v })} />
                <Text label="Location" value={r.place} onChange={(v) => upd({ place: v })} />
                <Text label="Period" hint="e.g. Feb 2026 — Present" value={r.period} onChange={(v) => upd({ period: v })} />
                <div className="span2"><Toggle label="Current role" value={!!r.current} onChange={(v) => upd({ current: v })} /></div>
                <div className="span2"><Area label="Intro (optional)" rows={2} value={r.intro ?? ""} onChange={(v) => upd({ intro: v || undefined })} /></div>
                <div className="span2"><ListText label="Achievements" value={r.points} onChange={(v) => upd({ points: v })} /></div>
                <div className="span2"><ListText label="Tech" sep="," value={r.stack ?? []} onChange={(v) => upd({ stack: v })} /></div>
              </div>
            )}
          />
        )}

        {tab === "Projects" && (
          <ListEditor<Project>
            items={content.projects}
            onChange={(v) => set("projects", v)}
            title={(p) => p.name}
            make={() => ({ name: "New project", kind: "", description: "", highlights: [], stack: [], metric: { value: "", label: "" }, link: "" })}
            addLabel="Add project"
            render={(p, upd) => (
              <div className="grid2">
                <Text label="Name" value={p.name} onChange={(v) => upd({ name: v })} />
                <Text label="Type" hint="e.g. Construction lead marketplace" value={p.kind} onChange={(v) => upd({ kind: v })} />
                <div className="span2"><Text label="Live / repo link (optional)" value={p.link ?? ""} onChange={(v) => upd({ link: v })} /></div>
                <div className="span2"><Area label="Description" rows={3} value={p.description} onChange={(v) => upd({ description: v })} /></div>
                <Text label="Headline metric" hint="e.g. ~40%" value={p.metric.value} onChange={(v) => upd({ metric: { ...p.metric, value: v } })} />
                <Text label="Metric label" hint="e.g. less database load" value={p.metric.label} onChange={(v) => upd({ metric: { ...p.metric, label: v } })} />
                <div className="span2"><ListText label="Highlights" value={p.highlights} onChange={(v) => upd({ highlights: v })} /></div>
                <div className="span2"><ListText label="Tech" sep="," value={p.stack} onChange={(v) => upd({ stack: v })} /></div>
              </div>
            )}
          />
        )}

        {tab === "Skills" && (
          <ListEditor<SkillGroup>
            items={content.skills}
            onChange={(v) => set("skills", v)}
            title={(g) => g.group}
            make={() => ({ group: "New group", items: [] })}
            addLabel="Add skill group"
            render={(g, upd) => (
              <div className="grid2">
                <div className="span2"><Text label="Group name" value={g.group} onChange={(v) => upd({ group: v })} /></div>
                <div className="span2"><ListText label="Skills" sep="," value={g.items} onChange={(v) => upd({ items: v })} /></div>
              </div>
            )}
          />
        )}

        {tab === "Education" && (
          <div className="grid2">
            <Text label="Degree" value={content.education.degree} onChange={(v) => set("education", { ...content.education, degree: v })} />
            <Text label="School" value={content.education.school} onChange={(v) => set("education", { ...content.education, school: v })} />
            <Text label="Period" value={content.education.period} onChange={(v) => set("education", { ...content.education, period: v })} />
            <Text label="Score" value={content.education.score} onChange={(v) => set("education", { ...content.education, score: v })} />
          </div>
        )}

        {tab === "Messages" && (
          <div className="messages">
            {messages.length === 0 && <p className="empty">No messages yet. They&apos;ll appear here when someone uses the contact form.</p>}
            {messages.map((m) => (
              <article key={m.id} className={`msg ${m.read ? "" : "unread"}`}>
                <div className="msg-head">
                  <div>
                    <h3>{m.name}</h3>
                    <a href={`mailto:${m.email}`} className="gold">{m.email}</a>
                  </div>
                  <time className="mono muted">{new Date(m.createdAt).toLocaleString()}</time>
                </div>
                <p className="msg-body">{m.message}</p>
                <div className="msg-actions">
                  <a className="btn btn-primary btn-small" href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`}>Reply</a>
                  <button className="btn btn-ghost btn-small" onClick={() => setMsg(m.id, m.read ? "unread" : "read")}>
                    Mark {m.read ? "unread" : "read"}
                  </button>
                  <button className="btn btn-ghost btn-small danger" onClick={() => setMsg(m.id, "delete")}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {toast && <div className={`toast ${toast.kind}`} role="status">{toast.text}</div>}
    </div>
  );
}
