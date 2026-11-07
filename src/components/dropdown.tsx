"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./icons";

type Option = { value: string; label: string };

export function Dropdown({ label, value, options, onChange, title }: {
  label: string;
  value: string | number;
  options: Option[];
  onChange: (value: string) => void;
  title?: string;
}) {
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [above, setAbove] = useState(false);
  const search = useRef({ text: "", time: 0 });
  const selected = options.findIndex((option) => option.value === String(value));

  function show(index = selected < 0 ? 0 : selected) {
    const bounds = trigger.current?.getBoundingClientRect();
    if (bounds) setAbove(window.innerHeight - bounds.bottom < 250 && bounds.top > 250);
    setActive(index);
    setOpen(true);
  }
  function choose(index: number) {
    onChange(options[index].value);
    setOpen(false);
    trigger.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !ref.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  useEffect(() => {
    if (open) ref.current?.querySelector(`[data-option-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const key = event.key;
    if (key === "Tab") { setOpen(false); return; }
    if (key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(key)) {
      event.preventDefault();
      if (key === "Enter" || key === " ") {
        if (open) choose(active); else show();
      } else if (key === "Home" || key === "End") {
        const index = key === "Home" ? 0 : options.length - 1;
        if (open) setActive(index); else show(index);
      } else if (!open) {
        show();
      } else {
        setActive((index) => Math.max(0, Math.min(options.length - 1, index + (key === "ArrowDown" ? 1 : -1))));
      }
    } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const text = now - search.current.time > 700 ? key : search.current.text + key;
      search.current = { text, time: now };
      const index = options.findIndex((option) => option.label.toLowerCase().startsWith(text.toLowerCase()));
      if (index >= 0) { if (open) setActive(index); else show(index); }
    }
  }

  return <span className="dropdown" ref={ref} onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <button ref={trigger} type="button" role="combobox" className="dropdown-trigger" aria-label={label}
      aria-expanded={open} aria-haspopup="listbox" aria-controls={open ? id : undefined}
      aria-activedescendant={open ? `${id}-${active}` : undefined} title={title}
      onClick={() => { if (open) setOpen(false); else show(); }} onKeyDown={keyDown}>
      <span>{options[selected]?.label ?? options[0]?.label}</span>
      <svg className={`dropdown-arrow ${open ? "open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </button>
    {open && <span id={id} role="listbox" aria-label={label} className={`dropdown-list ${above ? "above" : ""}`}
      onMouseDown={(event) => event.preventDefault()}>
      {options.map((option, index) => <span key={option.value} id={`${id}-${index}`} role="option"
        aria-selected={index === selected} data-option-index={index}
        className={`dropdown-option ${index === active ? "highlighted" : ""}`}
        onMouseEnter={() => setActive(index)} onClick={(event) => { event.preventDefault(); choose(index); }}>
        <span>{option.label}</span>{index === selected && <Icon name="check" size={15} />}
      </span>)}
    </span>}
  </span>;
}
