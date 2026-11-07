import type { Metadata } from "next";
import { Planner } from "@/components/planner";

export const metadata: Metadata = { title: "Prep sessions | Batch & Budget" };

export default function PrepSessionsPage() {
  return <Planner section="prep" />;
}
