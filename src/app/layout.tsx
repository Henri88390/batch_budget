import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Batch & Budget | Meal planner",
  description: "A batch-cooking meal planner with portion targets, prep sessions, and budget-aware shopping lists.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
