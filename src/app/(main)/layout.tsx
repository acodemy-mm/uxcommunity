import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SidebarOpenProvider } from "@/components/SidebarContext";
import { SidebarWrapper } from "@/components/SidebarWrapper";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="dark bg-background text-foreground min-h-screen">
      <SidebarOpenProvider>
        <SidebarWrapper>
          <Sidebar />
        </SidebarWrapper>
        <div className="min-h-screen pl-0 lg:pl-72">
          <Header />
          <main className="min-h-screen">{children}</main>
        </div>
      </SidebarOpenProvider>
    </div>
  );
}
