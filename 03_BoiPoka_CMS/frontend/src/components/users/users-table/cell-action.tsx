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
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useNavigate } from "react-router";
import axiosInstance from "@/utils/axios-instance";

interface CellActionProps {
  data: Admin;
  onDelete: (id: string) => void;
  onUpdateAdmin: (updatedAdmin: Admin) => void;
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
  onDelete,
  onUpdateAdmin,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigateTo = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { userType } = useSelector((state: RootState) => state.auth);
  const [privileges, setPrivileges] = useState<string[]>(data.accessTo || []);

  // List of possible privileges (similar to your UpdateAdminPage)
  const allPrivileges = [
    "create-user",
    "get-user",
    "update-user",
    "delete-user",
    "deactivate-user",
    "activate-user",
    "get-book",
    "update-userbooks",
    "delete-userbooks",
    "get-userbooks",
  ];

  useEffect(() => {
    setPrivileges(data.accessTo || []);
  }, [data.accessTo]);

  const onConfirm = async () => {
    if (!data.id) {
      console.error("No ID found for deletion.");
      return;
    }

    setLoading(true);
    await onDelete(data.id);
    setLoading(false);
    setOpen(false);
  };

  const handleUpdateAdmin = () => {
    navigateTo(`/update-admin/${data.id}`);
  };

  const handleUpdatePrivileges = () => {
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
        `/superadmin/updateAccess/${data._id}`,
        { accessTo: privileges },

      if (response.status === 200) {
        console.log("Updated Privileges:", response.data);
        setDialogOpen(false);

        onUpdateAdmin({
          ...data,
          accessTo: privileges, // Update the accessTo field
        });
      }
    } catch (error) {
      console.error("Failed to update privileges:", error);
      alert("Error updating privileges. Please try again.");
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
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
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
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
          {userType === "SuperAdmin" && (
            <DropdownMenuItem onClick={handleUpdatePrivileges}>
              <Shield className="mr-2 h-4 w-4" /> Update Privileges
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
