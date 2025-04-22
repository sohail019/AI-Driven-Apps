import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminLoginSchema,
  AdminLoginFormData,
} from "@/schemas/auth/admin-schema";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/auth-slice";
import axiosInstance from "@/utils/axios-instance";
import { toast } from "sonner";
import { AxiosError } from "axios";

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      const response = await axiosInstance.post("admin/login", data);
      const { token, refreshToken, tokenExpiryDate, adminInfo } = response.data;

      dispatch(
        login({
          token,
          refreshToken,
          tokenExpiryDate,
          userType: "Admin",
          adminInfo,
        })
      );

      toast.success("Login successful");
      navigate("/dashboard");
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
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your credentials below to log in to your account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@boipoka.com"
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
              <div className="flex items-center justify-between ">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    {...register("rememberMe")}
                    className="mr-2"
                  />
                  <Label htmlFor="rememberMe">Remember me</Label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginForm;
