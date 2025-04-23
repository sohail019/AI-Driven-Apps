import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ShieldAlert } from "lucide-react";

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-full">
            <ShieldAlert className="h-16 w-16 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You don't have permission to access this page. If you believe this is
          an error, please contact the administrator.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/profile">View Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
