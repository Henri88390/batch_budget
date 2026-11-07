import type { Metadata } from "next";
import { Planner } from "@/components/planner";

export const metadata: Metadata = { title: "Preferences | Batch & Budget" };

export default function PreferencesPage() {
  return <Planner section="preferences" />;
}
