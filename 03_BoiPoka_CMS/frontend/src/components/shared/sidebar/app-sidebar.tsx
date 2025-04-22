import * as React from "react";
import { Book, LogOut, SquareTerminal, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { NavMenu } from "./nav-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  menu: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
    },
    {
      name: "Admins",
      url: "/admins",
      icon: Users,
    },
    {
      name: "Users",
      url: "/users",
      icon: Users,
    },
    {
      name: "Books",
      url: "/books",
      icon: Book,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userType } = useSelector(() => {
    return {
      userType: "SuperAdmin",
    };
  });
  const filteredNavMain = data.menu.filter((item) => {
    if (userType === "SuperAdmin") {
      return true;
    }
    if (userType === "Admin") {
      return item.name !== "Admins";
    }
    return false;
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <img
          src="/logo.png"
          alt="Logo"
          className="w-12 bg-none dark:bg-white"
        />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={filteredNavMain} /> */}
        <NavMenu menu={filteredNavMain} />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
        <button
          className="flex items-center p-2 mt-4 text-sm font-medium rounded-md"
          onClick={() => {}}
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span>Logout</span>
        </button>
        {/* <UserNav /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
