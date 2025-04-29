import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Settings,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  FileBadge,
  BarChart3,
  BookOpen,
  Music,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setSidebarState } from "../../store/slices/settingsSlice";
import { cn } from "../../lib/utils";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const toggleCollapse = () => {
    dispatch(setSidebarState(!collapsed));
  };

  return (
    <aside
      className={cn(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <span className="text-xl font-semibold text-gray-800 dark:text-white">
              BoiPoka
            </span>
          )}
          <button
            className="rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
            onClick={toggleCollapse}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            <SidebarItem
              to="/dashboard"
              icon={<LayoutDashboard className="h-5 w-5" />}
              label={t("navigation.dashboard")}
              collapsed={collapsed}
            />
            <SidebarItem
              to="/cms/pages"
              icon={<FileText className="h-5 w-5" />}
              label="Pages"
              collapsed={collapsed}
            />

            <SidebarItem
              to="/cms/posts"
              icon={<FileBadge className="h-5 w-5" />}
              label="Posts"
              collapsed={collapsed}
            />
            <SidebarItem
              to="/users"
              icon={<Users className="h-5 w-5" />}
              label={t("navigation.users")}
              collapsed={collapsed}
            />
            <SidebarItem
              to="/admins"
              icon={<Users className="h-5 w-5" />}
              label="Admins"
              collapsed={collapsed}
            />
            <SidebarItem
              to="/books"
              icon={<BookOpen className="h-5 w-5" />}
              label={t("navigation.books")}
              collapsed={collapsed}
            />
            <SidebarItem
              to="/charts"
              icon={<BarChart3 className="h-5 w-5" />}
              label={t("charts.title")}
              collapsed={collapsed}
            />
            <SidebarItem
              to="/cms/subscriptions"
              icon={<BarChart3 className="h-5 w-5" />}
              label="Subscriptions"
              collapsed={collapsed}
            />

            <SidebarItem
              to="/ai-spotify"
              icon={<Music className="h-5 w-5" />}
              label="AI Spotify"
              collapsed={collapsed}
            />

            <SidebarItem
              to="/profile"
              icon={<UserCircle className="h-5 w-5" />}
              label="Profile"
              collapsed={collapsed}
            />
            <SidebarItem
              to="/settings"
              icon={<Settings className="h-5 w-5" />}
              label={t("navigation.settings")}
              collapsed={collapsed}
            />
          </ul>
        </nav>

        {/* Version */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <p className="text-xs text-gray-500 dark:text-gray-400">v1.0.0</p>
          )}
        </div>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const SidebarItem = ({ to, icon, label, collapsed }: SidebarItemProps) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center px-3 py-2 rounded-md transition-colors",
            isActive
              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white",
            collapsed ? "justify-center" : "justify-start"
          )
        }
      >
        {icon}
        {!collapsed && <span className="ml-3">{label}</span>}
      </NavLink>
    </li>
  );
};

export default Sidebar;
