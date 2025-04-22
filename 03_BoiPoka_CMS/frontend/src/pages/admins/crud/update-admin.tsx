import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { z } from "zod";

// Define the validation schema
const UpdateAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(1, "Mobile number is required"),
  accessTo: z.array(z.string()).optional(),
});

// Extract the type from the schema
type UpdateAdminFormData = z.infer<typeof UpdateAdminSchema>;

// Define the admin interface that matches the API response
interface AdminResponse {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  accessTo: string[];
  isActive: boolean;
}

const UpdateAdminPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAccess, setSelectedAccess] = useState<string[]>([]);
  const [adminData, setAdminData] = useState<AdminResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateAdminFormData>({
    resolver: zodResolver(UpdateAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      accessTo: [],
    },
  });

  // Fetch admin data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!id) {
        // Don't redirect - id might not be available on initial render
        return;
      }

      setLoading(true);
      try {
        const response = await axiosInstance.get<{ data: AdminResponse }>(
          `/super-admin/admins/${id}`
        );

        // For debugging
        console.log("API Response:", response);

        const admin = response.data;

        // Handle different response structures gracefully
        const adminData = admin.data || admin;

        // Store the admin data in state
        setAdminData(adminData);

        // For debugging
        console.log("Admin data:", adminData);

        // Prefill the form with admin data
        reset({
          name: adminData.name || "",
          email: adminData.email || "",
          mobile: adminData.mobile || "",
          accessTo: adminData.accessTo || [],
        });

        // Update the selected access state
        setSelectedAccess(adminData.accessTo || []);
      } catch (error) {
        // For debugging
        console.error("Error fetching admin:", error);

        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch admin data";
        toast.error(errorMessage);
        navigate("/admins");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [id, reset, navigate]);

  // Handle form submission
  const onSubmit = async (data: UpdateAdminFormData) => {
    if (!id) {
      toast.error("Admin ID is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.put(`/super-admin/admins/${id}`, {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        accessTo: selectedAccess,
      });

      toast.success("Admin updated successfully");
      navigate("/admins");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update admin";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle access control changes
  const handleAccessChange = (access: string) => {
    setSelectedAccess((prev) =>
      prev.includes(access)
        ? prev.filter((item) => item !== access)
        : [...prev, access]
    );
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2">Loading admin data...</span>
      </div>
    );
  }

  // Show error if admin data couldn't be loaded
  if (!adminData && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">Failed to load admin data</p>
        <Button onClick={() => navigate("/admins")}>
          Return to Admin List
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Update Admin
              </CardTitle>
              <CardDescription className="text-gray-600">
                Update admin details for {adminData?.name || ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Full Name"
                    {...register("name")}
                    className="text-sm"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    {...register("email")}
                    className="text-sm"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="text"
                    placeholder="Mobile Number"
                    {...register("mobile")}
                    className="text-sm"
                  />
                  {errors.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Access Control</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "get-user",
                      "deactivate-user",
                      "activate-user",
                      "get-book",
                      "update-userbooks",
                      "delete-userbooks",
                      "get-userbooks",
                      "genre",
                    ].map((access) => (
                      <label
                        key={access}
                        className="flex items-center space-x-2 p-2 border rounded-md shadow-sm transition duration-200 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          value={access}
                          checked={selectedAccess.includes(access)}
                          onChange={() => handleAccessChange(access)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded text-sm"
                        />
                        <span>
                          {access
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admins")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={
                      isSubmitting || (!isDirty && selectedAccess.length === 0)
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Admin"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default UpdateAdminPage;
