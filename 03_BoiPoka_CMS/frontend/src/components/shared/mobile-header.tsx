import { usePathname } from "@/routes/hooks";
import UserNav from "./user-nav";
import { ModeToggle } from "./theme-toggle";

import { SidebarTrigger } from "../ui/sidebar";

export default function MobileHeader() {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 items-center justify-between bg-secondary px-4 ">
      {/* <Heading title={headingText} /> */}
      <SidebarTrigger />
      {/* <img src="/logo.svg" alt="Logo" className="w-24 h-16 bg-red-500" /> */}
      <div className="flex items-center ">
        <UserNav />
        <ModeToggle />
      </div>
    </div>
  );
}
