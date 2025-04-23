import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            CMS Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Content Management System
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 px-6 py-8 rounded-lg shadow-sm w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
