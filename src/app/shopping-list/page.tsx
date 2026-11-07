import type { Metadata } from "next";
import { Planner } from "@/components/planner";

export const metadata: Metadata = { title: "Shopping list | Batch & Budget" };

export default function ShoppingListPage() {
  return <Planner section="groceries" />;
}
