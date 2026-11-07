"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Localize } from "./display-settings";

export function SectionHelp({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent | KeyboardEvent) {
      if (event instanceof KeyboardEvent ? event.key === "Escape" :
        event.target instanceof Node && !ref.current?.contains(event.target)) {
        setOpen(false);
        setPinned(false);
      }
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", dismiss);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", dismiss);
    };
  }, [open]);

  return <Localize><span ref={ref} className="prep-help" onMouseEnter={() => setOpen(true)} onMouseLeave={() => { if (!pinned) setOpen(false); }}>
    <button type="button" className="help-button" aria-label={label} aria-expanded={open} aria-controls={open ? id : undefined}
      aria-describedby={open ? id : undefined}
      onFocus={() => setOpen(true)} onBlur={() => { if (!pinned) setOpen(false); }}
      onClick={() => { setPinned(!pinned); setOpen(!pinned); }}>?</button>
    {open && <span id={id} role="tooltip" className="help-popover">
      {children}
    </span>}
  </span></Localize>;
}
