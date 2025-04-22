import UserNav from "@/components/shared/user-nav";
import { usePathname } from "@/routes/hooks";
import { ModeToggle } from "./theme-toggle";
import { SidebarTrigger } from "../ui/sidebar";

export default function Header() {
  const pathname = usePathname();
  // const headingText = useMatchedPath(pathname);

  return (
    <div className="hidden md:flex items-center justify-between bg-secondary px-4 py-2 shadow-md">
      <SidebarTrigger />
      <div className="flex items-center space-x-4">
        {/* <img src="/logo.svg" alt="Logo" className="w-24 h-16" /> */}
        {/* <Heading title={headingText} /> */}
      </div>
      <div className="flex items-center space-x-4">
        {/* <nav className="hidden md:flex space-x-4">
          <a href="/admin-login" className="text-sm font-medium text-primary">
            Admin Login
          </a>
          <a href="/superadmin-login" className="text-sm font-medium text-primary">
            Superadmin Login
          </a>
          <a href="/admin-register" className="text-sm font-medium text-primary">
            Admin Register
          </a>
        </nav> */}
        <ModeToggle />
        <UserNav />
        {/* <button
          onClick={handleLogout}
          className="text-sm font-medium text-primary"
        >
          Logout
        </button> */}
      </div>
    </div>
  );
}
