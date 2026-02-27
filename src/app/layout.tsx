import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "UX Forum - Articles, Courses, Podcasts & Jobs",
  description: "A community for UX professionals. Discover articles, video courses, podcasts, job posts, and design challenges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0f0f1e] text-slate-100">
        <Sidebar />
        <div className="pl-64">
          <Header />
          <main className="min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}
