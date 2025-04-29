import StatsCards from "../../components/dashboard/StatsCards";
import GenreDistribution from "../../components/dashboard/GenreDistribution";
import TopBooks from "../../components/dashboard/TopBooks";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of your book collection and user statistics
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts and Lists */}
      <div className="grid gap-6 md:grid-cols-2">
        <GenreDistribution />
        <TopBooks />
      </div>
    </div>
  );
};

export default DashboardPage;
