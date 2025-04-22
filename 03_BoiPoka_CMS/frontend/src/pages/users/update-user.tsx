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
import { z } from "zod";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateUserSchema } from "@/schemas/superadmin/user-schema";
import axiosInstance from "@/utils/axios-instance";
import axios from "axios";
import { Loader2 } from "lucide-react";

const UpdateUserPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/admin/getUser/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userData = response.data.data.user;
        console.log(userData);
        setInitialData(userData);
        reset({
          fullName: userData.fullName,
          email: userData.email,
          mobileNumber: userData.mobileNumber,
        });
      } catch (error) {
        console.error("Error fetching user data", error);
        toast({
          title: "Error",
          description: "Failed to load user data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: z.infer<typeof UpdateUserSchema>) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/admin/updateUser/${id}`, data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      navigate("/users");
    } catch (error) {
      console.error("Error in Updating User", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to update User";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !initialData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col">
        <Card className="w-full max-w-lg mt-2">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Update User
            </CardTitle>
            <CardDescription className="text-gray-600">
              Update User details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="User@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="text"
                  placeholder="User Mobile Number"
                  {...register("mobileNumber")}
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                Update User
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default UpdateUserPage;
