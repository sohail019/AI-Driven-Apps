import { AlertModal } from "@/components/shared/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Admin } from "@/constants/data";
import { Edit, MoreHorizontal, Shield, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "@/utils/axios-instance";
import { StopwatchIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

interface CellActionAdminProps {
  data: Admin;
  refreshData: () => void;
}

export const CellActionAdmin: React.FC<CellActionAdminProps> = ({
  data,
  refreshData,
}) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openToggleStatus, setOpenToggleStatus] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [privileges, setPrivileges] = useState<string[]>(data.accessTo || []);

  const allPrivileges = [
    "get-user",
    "deactivate-user",
    "activate-user",
    "get-book",
    "update-userbooks",
    "delete-userbooks",
    "get-userbooks",
    "genre",
  ];

  const handleConfirm = async (
    action: () => Promise<void>,
    setOpen: (open: boolean) => void
  ) => {
    if (!data._id) {
      console.error("No ID found for action.");
      return;
    }

    setLoading(true);
    try {
      await action();
      setOpen(false);
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (): Promise<void> => {
    try {
      await axiosInstance.delete(`/super-admin/admins/${data._id}`);
      toast.success("Admin deleted successfully");
      refreshData();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete admin";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleToggleAdminStatus = async (): Promise<void> => {
    try {
      const endpoint = data.isActive
        ? `/super-admin/admins/${data._id}/deactivate`
        : `/super-admin/admins/${data._id}/activate`;

      await axiosInstance.patch(endpoint);

      toast.success(
        `Admin ${data.isActive ? "deactivated" : "activated"} successfully`
      );

      refreshData();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update admin status";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleDelete = () => handleConfirm(handleDeleteAdmin, setOpenDelete);

  const handleToggleStatus = () =>
    handleConfirm(handleToggleAdminStatus, setOpenToggleStatus);

  const handleUpdateAdmin = () => {
    navigate(`/update-admin/${data._id}`);
  };

  const openPrivilegeDialog = () => {
    setDialogOpen(true);
  };

  const handlePrivilegeChange = (privilege: string) => {
    setPrivileges((prev) =>
      prev.includes(privilege)
        ? prev.filter((item) => item !== privilege)
        : [...prev, privilege]
    );
  };

  const handleSavePrivileges = async () => {
    try {
      const response = await axiosInstance.put(
        `/super-admin/admins/${data._id}`,
        { accessTo: privileges }
      );

      if (response.status === 200) {
        toast.success("Privileges updated successfully");
        setDialogOpen(false);
        refreshData();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update privileges";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
      <AlertModal
        isOpen={openToggleStatus}
        onClose={() => setOpenToggleStatus(false)}
        onConfirm={handleToggleStatus}
        loading={loading}
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Privileges</DialogTitle>
            <DialogDescription>
              Modify the privileges for <strong>{data.fullName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {allPrivileges.map((privilege) => (
              <label key={privilege} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={privileges.includes(privilege)}
                  onChange={() => handlePrivilegeChange(privilege)}
                />{" "}
                {privilege
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </label>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleSavePrivileges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleUpdateAdmin}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenToggleStatus(true)}>
            <StopwatchIcon className="mr-2 h-4 w-4" />{" "}
            {data.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openPrivilegeDialog}>
            <Shield className="mr-2 h-4 w-4" /> Update Privileges
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
