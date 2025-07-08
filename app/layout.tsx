// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // Pastikan Anda mengimpor CSS global

export const metadata: Metadata = {
  title: "MamayDedek",
  description: "MamayDedek app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}