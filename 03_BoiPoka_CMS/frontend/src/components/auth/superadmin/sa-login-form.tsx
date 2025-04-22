import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SuperAdminLoginSchema,
  AdminLoginFormData,
} from "@/schemas/auth/admin-schema";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/auth-slice";
import axiosInstance from "@/utils/axios-instance";
import { toast } from "sonner";
import { AxiosError } from "axios";

const SuperAdminLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(SuperAdminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      const response = await axiosInstance.post("/super-admin/login", data);
      console.log("Response:", response.data);
      console.log("Data:", data);
      const { token, refreshToken, tokenExpiryDate, adminInfo } = response.data;

      console.log("Dispatching login");
      dispatch(
        login({
          token,
          refreshToken,
          tokenExpiryDate,
          userType: "SuperAdmin",
          adminInfo,
        })
      );
      console.log("Login successful");
      toast.success("Login successful");
      navigate("/dashboard");
      console.log("Navigating to dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://img.freepik.com/free-vector/realistic-neon-lights-background_23-2148907367.jpg"
              alt="Background"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">SuperAdmin Login</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your credentials below to login.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="superadmin@digitalsalt.com"
                  className="text-sm md:text-base"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                {/* <InputPassword value="" onChange={() => {}} /> */}
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="text-sm md:text-base"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminLoginForm;
