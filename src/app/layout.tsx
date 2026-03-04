import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SidebarOpenProvider } from "@/components/SidebarContext";
import { SidebarWrapper } from "@/components/SidebarWrapper";

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-[#0f0f1e] text-slate-100" suppressHydrationWarning>
        <SidebarOpenProvider>
          <SidebarWrapper>
            <Sidebar />
          </SidebarWrapper>
          <div className="min-h-screen pl-0 lg:pl-64">
            <Header />
            <main className="min-h-screen">{children}</main>
          </div>
        </SidebarOpenProvider>
      </body>
    </html>
  );
}
