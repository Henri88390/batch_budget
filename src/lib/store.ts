"use client";

import { useSyncExternalStore } from "react";
import { formatDateKey } from "./domain/sampleData";
import { defaultState, parseSavedState, STORAGE_KEY, type SavedState } from "./storage";

type Snapshot = { data: SavedState; ready: boolean; today: string; error: string | null };
const serverSnapshot: Snapshot = { data: defaultState(), ready: false, today: "", error: null };
let snapshot = serverSnapshot;
let initialized = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function refreshDate() {
  const today = formatDateKey(new Date());
  if (snapshot.today !== today) {
    snapshot = { ...snapshot, today };
    emit();
  }
}

function initialize() {
  if (initialized) return;
  initialized = true;
  let data = defaultState();
  let error: string | null = null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) data = parseSavedState(raw);
  } catch (cause) {
    error = `Could not restore your planner: ${cause instanceof Error ? cause.message : "browser storage is unavailable"}. Your saved data has not been overwritten.`;
  }
  snapshot = { data, ready: true, today: formatDateKey(new Date()), error };
  window.addEventListener("focus", refreshDate);
  document.addEventListener("visibilitychange", refreshDate);
  window.setInterval(refreshDate, 60_000);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  initialize();
  return () => { listeners.delete(listener); };
}

export function updatePlanner(update: (state: SavedState) => SavedState) {
  const data = update(snapshot.data);
  let error: string | null = null;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (cause) {
    error = `Your changes work for this visit, but could not be saved: ${cause instanceof Error ? cause.message : "browser storage is unavailable"}.`;
  }
  snapshot = { ...snapshot, data, error };
  emit();
}

export function usePlannerStore() {
  return useSyncExternalStore(subscribe, () => snapshot, () => serverSnapshot);
}
