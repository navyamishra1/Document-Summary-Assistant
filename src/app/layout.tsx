import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Document Summary Assistant",
  description: "Intelligent document summarization, key points extraction, and OCR for PDF and image files.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
