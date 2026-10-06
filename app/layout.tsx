import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

import { QueryProvider } from "@/components/providers/query-provider";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Adminova",
  description: "E-Commerce Management Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <Analytics />
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
