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
import { CreateAdminSchema } from "@/schemas/superadmin/admin-schema";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";
import { toast } from "sonner";
import { useState } from "react";
import { AxiosError } from "axios";
import { z } from "zod";

type CreateAdminFormData = z.infer<typeof CreateAdminSchema>;

const CreateAdminPage = () => {
  const navigate = useNavigate();
  const [selectedAccess, setSelectedAccess] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAdminFormData>({
    resolver: zodResolver(CreateAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      accessTo: [],
    },
  });

  const onSubmit = async (data: CreateAdminFormData) => {
    try {
      setIsSubmitting(true);
      await axiosInstance.post("/super-admin/admins", {
        ...data,
        accessTo: selectedAccess,
      });
      toast.success("Admin created successfully");
      navigate("/admins");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to create admin"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccessChange = (access: string) => {
    setSelectedAccess((prev) =>
      prev.includes(access)
        ? prev.filter((item) => item !== access)
        : [...prev, access]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-sm">
        <div className="flex flex-col">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Create Admin
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter the details of the new user below
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
                      {errors.name.message as string}
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
                      {errors.email.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="text"
                    placeholder="User Mobile Number"
                    {...register("mobile")}
                    className="text-sm"
                  />
                  {errors.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.mobile.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>

                  <Input
                    type="text"
                    placeholder="Password"
                    {...register("password")}
                    className="text-sm"
                  />

                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message as string}
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
                        className="flex items-center space-x-2 p-2 border rounded-md shadow-sm transition duration-200"
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

                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Admin...
                    </>
                  ) : (
                    "Create Admin"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CreateAdminPage;
