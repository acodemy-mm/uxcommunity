import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SidebarOpenProvider } from "@/components/SidebarContext";
import { SidebarWrapper } from "@/components/SidebarWrapper";

export const metadata: Metadata = {
  title: "UXcellent — UX Design Community",
  description: "The UX community for articles, courses, podcasts, challenges and jobs.",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground" suppressHydrationWarning>
        <SidebarOpenProvider>
          <SidebarWrapper>
            <Sidebar />
          </SidebarWrapper>
          <div className="min-h-screen pl-0 lg:pl-72">
            <Header />
            <main className="min-h-screen">{children}</main>
          </div>
        </SidebarOpenProvider>
      </body>
    </html>
  );
}
