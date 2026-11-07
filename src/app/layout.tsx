import type { Metadata } from "next";
import "./globals.css";
import { DisplayProvider } from "@/components/display-settings";

export const metadata: Metadata = {
  description: "A batch-cooking meal planner with portion targets, prep sessions, and budget-aware shopping lists.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><DisplayProvider>{children}</DisplayProvider></body>
    </html>
  );
}
