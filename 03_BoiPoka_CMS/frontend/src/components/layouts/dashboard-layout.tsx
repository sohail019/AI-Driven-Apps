import MobileHeader from "../shared/mobile-header";
import Header from "../shared/header";
import Breadcrumbs from "../shared/breadcrumbs";
import { AppSidebar } from "../shared/sidebar/app-sidebar";
import { SidebarProvider } from "../ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-secondary ">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex w-0 flex-1 flex-col overflow-hidden ">
          <Header />
          <div className="relative z-10 flex h-20 flex-shrink-0 md:hidden">
            <MobileHeader />
          </div>
          <main className="relative flex-1 overflow-y-auto ">
            <div className="mx-2 my-3 mr-2  ml-2 rounded-xl bg-background p-4 ">
              <Breadcrumbs />
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
