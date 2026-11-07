import type { Metadata } from "next";
import { Planner } from "@/components/planner";

export const metadata: Metadata = { title: "Meal list | Batch & Budget" };

export default function MenuPage() {
  return <Planner section="recipes" />;
}
