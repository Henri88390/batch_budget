"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./icons";

export function IngredientConfirmation({ name, children, onConfirm, onCancel }: {
  name: string; children: ReactNode; onConfirm: () => void; onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);

  return <dialog ref={ref} className="ingredient-confirmation" aria-labelledby="ingredient-confirmation-title"
    onCancel={(event) => { event.preventDefault(); event.stopPropagation(); onCancel(); }}
    onClick={(event) => {
      event.stopPropagation();
      if (event.target === event.currentTarget) onCancel();
    }}>
    <span className="confirmation-icon"><Icon name="trash" size={24} /></span>
    <h2 id="ingredient-confirmation-title">Exclude {name}?</h2>
    <p className="small muted">This ingredient will be excluded throughout the plan. Other meals use automatic substitutes unless you choose a recipe-specific action below.</p>
    {children}
    <div className="button-row"><button type="button" className="button danger-button" onClick={onConfirm}><Icon name="trash" size={16} />Confirm exclusion</button><button type="button" className="button" autoFocus onClick={onCancel}>Cancel</button></div>
  </dialog>;
}
