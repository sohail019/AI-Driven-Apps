import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema } from "@/schemas/profile-schema";
import { z } from "zod";
import InputPassword from "@/components/shared/password-validation";
import { useNavigate } from "react-router-dom";

const ChangePasswordForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  return (
    <form onSubmit={() => {}} className="space-y-4 text-sm">
      <div className="flex flex-col gap-6 w-1/2 ">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Change Password</CardTitle>
            <CardDescription>
              Enter your current and new password below to change it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <InputPassword
                  value={watch("currentPassword") || ""}
                  onChange={(e) => setValue("currentPassword", e.target.value)}
                />
                {errors.currentPassword && (
                  <p className="text-red-500">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <InputPassword
                  value={watch("newPassword") || ""}
                  onChange={(e) => setValue("newPassword", e.target.value)}
                />
                {errors.newPassword && (
                  <p className="text-red-500">
                    {typeof errors.newPassword?.message === "string" &&
                      errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <InputPassword
                  value={watch("confirmNewPassword") || ""}
                  onChange={(e) =>
                    setValue("confirmNewPassword", e.target.value)
                  }
                />
                {errors.confirmNewPassword && (
                  <p className="text-red-500">
                    {typeof errors.confirmNewPassword?.message === "string" &&
                      errors.confirmNewPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
