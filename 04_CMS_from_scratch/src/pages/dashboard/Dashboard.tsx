import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Users, FileText, Image, ArrowUpRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useTranslation } from "react-i18next";
import LineChart from "../../components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";

const Dashboard = () => {
  const { t } = useTranslation();
  const { adminInfo } = useSelector((state: RootState) => state.auth);
  const username =
    adminInfo?.fullName ?? t("common.defaultUser", { defaultValue: "User" });

  const stats = [
    {
      title: "Total Pages",
      value: "12",
      icon: <FileText className="h-6 w-6" />,
      change: "+2 this week",
    },
    {
      title: "Total Users",
      value: "24",
      icon: <Users className="h-6 w-6" />,
      change: "+5 this month",
    },
    {
      title: "Media Files",
      value: "134",
      icon: <Image className="h-6 w-6" />,
      change: "+12 this month",
    },
    {
      title: "Published",
      value: "8",
      icon: <FileText className="h-6 w-6" />,
      change: "+1 today",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Page updated",
      target: "About Us",
      user: "John Doe",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Media uploaded",
      target: "hero-image.jpg",
      user: "Jane Smith",
      time: "5 hours ago",
    },
    {
      id: 3,
      action: "User registered",
      target: "alex@example.com",
      user: "System",
      time: "1 day ago",
    },
    {
      id: 4,
      action: "Settings changed",
      target: "Site Title",
      user: "Admin",
      time: "2 days ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {/* Welcome back, {user?.name || "User"} */}
              {/* {t("dashboard.welcome ")} */}
              {/* {t("dashboard.welcome", { name: user?.name || "Sohail" })} */}
              {t("dashboard.welcome", { name: username })}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {/* Here's what's happening with your CMS today. */}
              {t("dashboard.recentActivity")}
            </p>
          </div>
          <Button className="flex items-center gap-2 bg-blue-500 text-white">
            <FileText className="h-4 w-4" /> {t("dashboard.createNew")}
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                {stat.icon}
              </div>
              <span className="text-sm text-green-500 flex items-center">
                {stat.change} <ArrowUpRight className="ml-1 h-3 w-3" />
              </span>
            </div>
            <h3 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">
              {stat.value}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Chart Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("charts.quickOverview")}
        </h2>
        <div className="h-[300px] flex gap-4 justify-center items-center w-full ">
          <LineChart />
          <BarChart />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="py-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.target} by {activity.user}
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
