import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { updateUser } from "../store/slices/authSlice";
import { Button } from "../components/ui/button";
import { User, Pencil, Save, X } from "lucide-react";
import { profileUpdateSchema } from "../schemas/auth.schema";
import { userAPI } from "../lib/api";
import { z } from "zod";

type ProfileFormData = z.infer<typeof profileUpdateSchema>;

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    try {
      profileUpdateSchema.parse(formData);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update profile via API
      await userAPI.updateProfile({
        id: user?.id || "",
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
      });

      // Update user in Redux store
      dispatch(
        updateUser({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
        })
      );

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
    });
    setFormErrors({});
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Profile
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage your personal information
              </p>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" /> Edit Profile
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={cancelEdit}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" /> Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Profile Picture */}
        <div className="p-6 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              {user?.name ? (
                <span className="text-4xl font-semibold text-gray-500 dark:text-gray-300">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              ) : (
                <User className="w-16 h-16 text-gray-500 dark:text-gray-300" />
              )}
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mx-6 mb-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-md">
            {success}
          </div>
        )}

        {error && (
          <div className="mx-6 mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Profile Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Full Name
                </label>
                {isEditing ? (
                  <>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border ${
                        formErrors.name
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formErrors.name}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email Address
                </label>
                {isEditing ? (
                  <>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 border ${
                        formErrors.email
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {formErrors.email}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {user?.email}
                  </p>
                )}
              </div>

              {/* Mobile Field */}
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Mobile Number
                </label>
                {isEditing ? (
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    autoComplete="tel"
                    value={formData.mobile || ""}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {user?.mobile || "Not provided"}
                  </p>
                )}
              </div>

              {/* Role Information (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                  {user?.role || "N/A"}
                </p>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div>
                  <Button
                    type="submit"
                    className="flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Security
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update your password
          </p>
        </div>

        <div className="p-6">
          <Button variant="outline" asChild>
            <a href="/settings">Change Password</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
