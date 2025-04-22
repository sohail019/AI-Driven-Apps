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
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileUpdateSchema } from "@/schemas/profile-schema";
import { z } from "zod";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileUpdateForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof ProfileUpdateSchema>>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      name: "", 
      email: "",
      role: "",
      mobileNumber: "",
    },
  });

  useEffect(() => {
    const fetchData = () => {
      try {
        const profileData = JSON.parse(localStorage.getItem("profileData") || "{}");
        const { name, email, role, mobileNumber } = profileData;
        setValue("name", name || "");
        setValue("email", email || "");
        setValue("role", role || "");
        setValue("mobileNumber", mobileNumber || "");

      } catch (error) {
        console.error("Failed to fetch profile data from localStorage", error);
      }
    };
    fetchData();
  }, [setValue]);

  const onSubmit = async (data: z.infer<typeof ProfileUpdateSchema>) => {
    try {
      console.log("Profile details updated", data);
      localStorage.setItem("profileData", JSON.stringify(data));
      toast({
        title: "Success",
        description: "Profile details updated",
      });
      navigate("/profile");
    } catch (error) {
      console.error("Profile update failed", error);
      toast({
        title: "Error",
        description: "Profile update failed",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col ">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Profile Update</CardTitle>
            <CardDescription className="text-gray-600">Update your profile details below</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  {...register("name")}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your-email@example.com"
                  {...register("email")}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  {...register("role")}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-transparent"
                  required
                >
                  <option value="Admin" className="bg-white text-black">Admin</option>
                  <option value="SuperAdmin" className="bg-white text-black">SuperAdmin</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="text"
                  placeholder="Your Mobile Number"
                  {...register("mobileNumber")}
                  required
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm">{errors.mobileNumber.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full mt-4">
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default ProfileUpdateForm;
