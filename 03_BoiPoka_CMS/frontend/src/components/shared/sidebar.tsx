import { useState } from "react";
import { ChevronsLeft, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { navItems } from "@/constants/data";
import DashboardNav from "./dashboard-nav";
import { useLocation } from "react-router-dom";

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);
  const location = useLocation();

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  return (
    <nav
      className={cn(
        `relative z-10 hidden h-screen flex-none px-3 md:block`,
        status && "duration-500",
        !isMinimized ? "w-72" : "w-[80px]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center px-0 py-5 md:px-2",
          isMinimized ? "justify-center" : "justify-between"
        )}
      >
        {!isMinimized && (
          <>
            <img src="/logo.png" alt="Logo" className="w-16" />
          </>
        )}
        <ChevronsLeft
          className={cn(
            "size-8 cursor-pointer rounded-full border bg-background text-foreground",
            isMinimized && "rotate-180"
          )}
          onClick={handleToggle}
        />
      </div>

      <div className="flex flex-col h-full overflow-y-auto ">
        <div className="flex-grow">
          <div className="px-2">
            <DashboardNav items={navItems} activePath={location.pathname} />
          </div>
        </div>

        <div className="mt-auto flex flex-col items-start gap-4 pb-24 px-2">
          <LogOut className="w-6 h-6 cursor-pointer" />
          <Settings className="w-6 h-6 cursor-pointer" />
        </div>
      </div>
    </nav>
  );
}
