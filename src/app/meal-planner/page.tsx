import type { Metadata } from "next";
import { Planner } from "@/components/planner";

export const metadata: Metadata = { title: "Meal calendar | Batch & Budget" };

export default function MealPlannerPage() {
  return <Planner section="planner" />;
}
