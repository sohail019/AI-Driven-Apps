import { UserRole } from "../lib/api/auth";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface RoleSelectorProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  className?: string;
}

export default function RoleSelector({
  selectedRole,
  onRoleChange,
  className,
}: RoleSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("flex space-x-2", className)}>
      <Button
        variant={selectedRole === "admin" ? "default" : "outline"}
        onClick={() => onRoleChange("admin")}
        className="flex-1"
      >
        {t("auth.roles.admin")}
      </Button>
      <Button
        variant={selectedRole === "superadmin" ? "default" : "outline"}
        onClick={() => onRoleChange("superadmin")}
        className="flex-1"
      >
        {t("auth.roles.superadmin")}
      </Button>
    </div>
  );
}
