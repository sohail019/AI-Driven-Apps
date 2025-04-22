import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import InputPassword from "../../shared/password-validation";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/schemas/auth/admin-schema";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";
import { toast } from "sonner";
import { AxiosError } from "axios";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      await axiosInstance.post("/admin/reset-password", {
        token,
        password: data.password,
      });
      toast.success("Password reset successful");
      navigate("/admin-login");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Password reset failed"
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://img.freepik.com/free-vector/realistic-neon-lights-background_23-2148907367.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 h-96">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your new password below to reset it
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <InputPassword
                  value=""
                  onChange={(value) =>
                    register("password").onChange({ target: { value } })
                  }
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <InputPassword
                  value=""
                  onChange={(value) =>
                    register("confirmPassword").onChange({ target: { value } })
                  }
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
