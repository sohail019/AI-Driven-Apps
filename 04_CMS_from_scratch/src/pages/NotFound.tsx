import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
            <FileQuestion className="h-16 w-16 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
