"use client";

import { useState } from "react";

type Base = { label: string; hint?: string };

export function Text({ label, hint, value, onChange, type = "text" }: Base & { value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Area({ label, hint, value, onChange, rows = 4 }: Base & { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

/** Edits a string[] as free text: one item per line, or comma separated. */
export function ListText({
  label,
  value,
  onChange,
  sep = "\n",
  rows,
}: Base & { value: string[]; onChange: (v: string[]) => void; sep?: "\n" | ","; rows?: number }) {
  const [text, setText] = useState(value.join(sep === "," ? ", " : "\n"));
  const split = (t: string) => t.split(sep).map((s) => s.trim()).filter(Boolean);
  return (
    <label className="field">
      <span>{label}</span>
      {sep === "," ? (
        <input value={text} onChange={(e) => { setText(e.target.value); onChange(split(e.target.value)); }} />
      ) : (
        <textarea rows={rows ?? Math.max(3, value.length + 1)} value={text} onChange={(e) => { setText(e.target.value); onChange(split(e.target.value)); }} />
      )}
      <small>{sep === "," ? "Separate with commas" : "One per line"}</small>
    </label>
  );
}

export function Toggle({ label, value, onChange }: Base & { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <i />
      <span>{label}</span>
    </label>
  );
}

/** Ordered list of cards with add, remove and reorder. */
export function ListEditor<T>({
  items,
  onChange,
  title,
  make,
  render,
  addLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  title: (item: T, i: number) => string;
  make: () => T;
  render: (item: T, set: (patch: Partial<T>) => void, i: number) => React.ReactNode;
  addLabel: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(j);
  };

  return (
    <div className="list-editor">
      {items.map((item, i) => (
        <div key={i} className={`item ${open === i ? "open" : ""}`}>
          <div className="item-head">
            <button type="button" className="item-title" onClick={() => setOpen(open === i ? null : i)}>
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="item-name">{title(item, i) || "Untitled"}</span>
              <span className="chev" aria-hidden>⌄</span>
            </button>
            <div className="item-actions">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">↓</button>
              <button
                type="button"
                className="danger"
                aria-label="Remove"
                onClick={() => {
                  if (!confirm(`Remove "${title(item, i) || "this item"}"?`)) return;
                  setOpen(null);
                  onChange(items.filter((_, k) => k !== i));
                }}
              >
                ✕
              </button>
            </div>
          </div>
          {open === i && (
            <div className="item-body">
              {render(item, (patch) => onChange(items.map((it, k) => (k === i ? { ...it, ...patch } : it))), i)}
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        className="add"
        onClick={() => {
          onChange([...items, make()]);
          setOpen(items.length);
        }}
      >
        + {addLabel}
      </button>
    </div>
  );
}
