import type { Metadata } from "next";
import "./globals.css";

import { QueryProvider } from "@/components/providers/query-provider";

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
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
