import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI, User } from "../../lib/api/users";
import {
  DataTable,
  DataTableColumn,
  DataTableAction,
} from "../../components/ui/data-table/DataTable";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Search, Edit, UserCheck, UserX } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";

const UsersList = () => {
  const navigate = useNavigate();
  const { error } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userAPI.getUsers({
        page: currentPage,
        limit: 10,
        sortOrder: "desc",
        fullName: searchTerm,
      });

      if (data) {
        setUsers(data.users);
        setTotalPages(Math.ceil(data.total / 10));
      } else {
        setUsers([]);
        setTotalPages(1);
        error("Failed to load users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      error("Failed to load users");
      setUsers([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleToggleStatus = async (user: User) => {
    setUserToToggle(user);
    setIsStatusDialogOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!userToToggle?._id) return;

    try {
      await userAPI.toggleUserStatus(userToToggle._id, !userToToggle.isActive);
      toast.success(
        `User ${
          userToToggle.isActive ? "deactivated" : "activated"
        } successfully`
      );
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error toggling user status:", err);
      toast.error("Failed to update user status");
    } finally {
      setIsStatusDialogOpen(false);
      setUserToToggle(null);
    }
  };

  const handleEditUser = async (user: User) => {
    try {
      const userDetails = await userAPI.getUserById(user._id);
      setUserToEdit(userDetails);
      setEditFormData(userDetails);
      setIsEditDialogOpen(true);
    } catch (err) {
      console.error("Error fetching user details:", err);
      toast.error("Failed to load user details");
    }
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    if (!userToEdit?._id) return;

    try {
      await userAPI.updateUser(userToEdit._id, editFormData);
      toast.success("User updated successfully");
      setIsEditDialogOpen(false);
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user");
    }
  };

  // Define columns for the data table
  const columns: DataTableColumn<User>[] = [
    {
      id: "fullName",
      header: "Full Name",
      cell: (user) => user.fullName,
      sortable: true,
    },
    {
      id: "email",
      header: "Email",
      cell: (user) => user.email || "N/A",
      sortable: true,
    },
    {
      id: "mobileNumber",
      header: "Mobile Number",
      cell: (user) => user.mobileNumber || "N/A",
      sortable: true,
    },
    {
      id: "userBookCount",
      header: "User Book Count",
      cell: (user) => {
        const userBookCount = user.userBookCount;
        return (
          <div className="px-12">
            {userBookCount ? <p> {userBookCount} </p> : <p>0</p>}
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: (user) => (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${
            user.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full mr-1.5 ${
              user.isActive ? "bg-green-600" : "bg-red-600"
            }`}
          ></span>
          {user.isActive ? "Active" : "Inactive"}
        </div>
      ),
      sortable: true,
    },
  ];

  // Define actions for each row
  const actions: DataTableAction<User>[] = [
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4 mr-2" />,
      onClick: handleEditUser,
    },
    {
      label: (user) => (user.isActive ? "Deactivate" : "Activate"),
      icon: (user) =>
        user.isActive ? (
          <UserX className="h-4 w-4 mr-2" />
        ) : (
          <UserCheck className="h-4 w-4 mr-2" />
        ),
      onClick: handleToggleStatus,
      variant: "outline",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
            Users
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your users and their permissions
          </p>
        </div>
        <Button onClick={() => navigate("/users/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={users}
        actions={actions}
        isLoading={isLoading}
        keyField="_id"
        pagination={{
          currentPage,
          totalPages,
          onPageChange: handlePageChange,
        }}
      />

      {/* Status Toggle Confirmation Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {userToToggle?.isActive ? "Deactivate" : "Activate"} User
            </DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to{" "}
            {userToToggle?.isActive ? "deactivate" : "activate"}{" "}
            {userToToggle ? userToToggle.fullName : "this user"}?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmToggleStatus} className="text-white">
              {userToToggle?.isActive ? "Deactivate" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={editFormData.fullName || ""}
                onChange={handleEditFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={editFormData.email || ""}
                onChange={handleEditFormChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mobileNumber" className="text-right">
                Mobile
              </Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                value={editFormData.mobileNumber || ""}
                onChange={handleEditFormChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} className="text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersList;
