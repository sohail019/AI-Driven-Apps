import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  setTheme,
  toggleNotifications,
  toggleNotificationSound,
} from "../store/slices/settingsSlice";
import { Button } from "../components/ui/button";
import { Moon, Sun, BellRing, BellOff, Volume2, VolumeX } from "lucide-react";
import { z } from "zod";
import { changePasswordSchema } from "../schemas/auth.schema";
import { userAPI } from "../lib/api";

type PasswordFormData = z.infer<typeof changePasswordSchema>;

const Settings = () => {
  const dispatch = useDispatch();
  const { theme, notifications } = useSelector(
    (state: RootState) => state.settings
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePasswordForm = (): boolean => {
    try {
      changePasswordSchema.parse(passwordForm);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await userAPI.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      setSuccess("Password updated successfully!");

      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(
        "Failed to update password. Please check your current password and try again."
      );
      console.error("Password change error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    dispatch(setTheme(newTheme));
  };

  const handleToggleNotifications = (enabled: boolean) => {
    dispatch(toggleNotifications(enabled));
  };

  const handleToggleNotificationSound = (enabled: boolean) => {
    dispatch(toggleNotificationSound(enabled));
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* App Preferences */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your application preferences
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Settings */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Theme
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => handleThemeChange("light")}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" /> Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => handleThemeChange("dark")}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" /> Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => handleThemeChange("system")}
              >
                System
              </Button>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Notifications
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {notifications.enabled ? (
                    <BellRing className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <BellOff className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Enable Notifications
                  </span>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-notifications"
                    checked={notifications.enabled}
                    onChange={(e) =>
                      handleToggleNotifications(e.target.checked)
                    }
                    className="peer absolute block w-6 h-6 rounded-full bg-white dark:bg-gray-300 appearance-none cursor-pointer border transition-all duration-200 ease-in-out checked:translate-x-4 checked:bg-white"
                  />
                  <label
                    htmlFor="toggle-notifications"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                      notifications.enabled
                        ? "bg-blue-500 dark:bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  ></label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {notifications.sound ? (
                    <Volume2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Notification Sounds
                  </span>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-sounds"
                    checked={notifications.sound}
                    onChange={(e) =>
                      handleToggleNotificationSound(e.target.checked)
                    }
                    disabled={!notifications.enabled}
                    className={`peer absolute block w-6 h-6 rounded-full bg-white dark:bg-gray-300 appearance-none cursor-pointer border transition-all duration-200 ease-in-out ${
                      !notifications.enabled && "opacity-50 cursor-not-allowed"
                    } checked:translate-x-4 checked:bg-white`}
                  />
                  <label
                    htmlFor="toggle-sounds"
                    className={`block overflow-hidden h-6 rounded-full ${
                      !notifications.enabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    } ${
                      notifications.sound && notifications.enabled
                        ? "bg-blue-500 dark:bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  ></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Change Password
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update your password to keep your account secure
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mx-6 mt-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-md">
            {success}
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="p-6">
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className={`block w-full px-3 py-2 border ${
                    formErrors.currentPassword
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
                  placeholder="••••••••"
                />
                {formErrors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className={`block w-full px-3 py-2 border ${
                    formErrors.newPassword
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
                  placeholder="••••••••"
                />
                {formErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`block w-full px-3 py-2 border ${
                    formErrors.confirmPassword
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
                  placeholder="••••••••"
                />
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full md:w-auto flex justify-center items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
