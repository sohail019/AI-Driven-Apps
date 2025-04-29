import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataTable,
  DataTableColumn,
  DataTableAction,
} from "../../components/ui/data-table/DataTable";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Search, Edit, UserCheck, UserX, Trash2 } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { Admin, adminAPI } from "@/lib/api/admins";
const AdminsList = () => {
  const navigate = useNavigate();
  const { error } = useToast();

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Safe access helper to prevent null pointer errors
  const safeString = (value: string | null | undefined): string => {
    return value || "";
  };

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await adminAPI.getAdmins();
      if (Array.isArray(data.admins)) {
        setAdmins(data.admins);
      } else {
        setAdmins([]);

        error("Failed to load admins");
      }
      //   setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching admins:", err);
      error("Failed to load admins");
      setAdmins([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);

    // Sort the users array based on the selected column and direction
    const sortedAdmins = [...admins].sort((a, b) => {
      // These variables will hold the values to compare
      let aValue: string | number;
      let bValue: string | number;

      // Handle special case for fullName which is a combination of fields
      if (column === "fullName") {
        aValue = `${safeString(a.fullName)}`.toLowerCase();
        bValue = `${safeString(b.fullName)}`.toLowerCase();
      } else if (column === "email") {
        aValue = safeString(a.email).toLowerCase();
        bValue = safeString(b.email).toLowerCase();
      } else if (column === "mobileNumber") {
        aValue = safeString(a.mobileNumber).toLowerCase();
        bValue = safeString(b.mobileNumber).toLowerCase();
      } else if (column === "status") {
        aValue = a.isActive ? "active" : "inactive";
        bValue = b.isActive ? "active" : "inactive";
      } else if (column === "updatedAt" || column === "createdAt") {
        // Handle date columns
        const aDate = a[column as keyof Admin] as string;
        const bDate = b[column as keyof Admin] as string;
        aValue = aDate ? new Date(aDate).getTime() : 0;
        bValue = bDate ? new Date(bDate).getTime() : 0;
      } else {
        // Default fallback for other columns
        aValue = safeString((a as any)[column]);
        bValue = safeString((b as any)[column]);
      }

      // Perform the actual comparison based on types
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setAdmins(sortedAdmins);
  };

  const handleDeleteAdmin = async (admin: Admin) => {
    if (!admin || !admin._id) {
      error("Invalid admin data");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${safeString(admin.fullName)}?`
      )
    ) {
      return;
    }

    // try {
    //   await userAPI.deleteUser(user._id);
    //   setUsers(users.filter((u) => u._id !== user._id));
    //   success(`User deleted successfully`);
    // } catch (err) {
    //   console.error("Error deleting user:", err);
    //   error("Failed to delete user");
    // }
  };

  const handleToggleStatus = async (admin: Admin) => {
    if (!admin || !admin._id) {
      error("Invalid admin data");
      return;
    }

    const newStatus = !admin.isActive;
    const action = newStatus ? "activate" : "deactivate";

    if (
      !window.confirm(
        `Are you sure you want to ${action} ${safeString(admin.fullName)}?`
      )
    ) {
      return;
    }

    // try {
    //   const updatedUser = await userAPI.toggleUserStatus(user._id, newStatus);
    //   setUsers(users.map((u) => (u._id === user._id ? updatedUser : u)));
    //   success(`User ${action}d successfully`);
    // } catch (err) {
    //   console.error(`Error ${action}ing user:`, err);
    //   error(`Failed to ${action} user`);
    // }
  };

  // Filter users based on search term - guard against non-array users
  const filteredAdmins = Array.isArray(admins)
    ? admins.filter((admin) => {
        if (!admin) return false;

        const fullName = `${safeString(admin.fullName)}`.toLowerCase();
        const email = safeString(admin.email).toLowerCase();
        const mobile = safeString(admin.mobileNumber).toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        return (
          fullName.includes(searchLower) ||
          email.includes(searchLower) ||
          mobile.includes(searchLower)
        );
      })
    : [];

  // Define columns for the data table
  const columns: DataTableColumn<Admin>[] = [
    {
      id: "fullName",
      header: "Full Name",
      cell: (admin) => safeString(admin.fullName) || "N/A",
      sortable: true,
    },
    {
      id: "email",
      header: "Email",
      cell: (admin) => safeString(admin.email) || "N/A",
      sortable: true,
    },
    {
      id: "mobileNumber",
      header: "Mobile",
      cell: (admin) => safeString(admin.mobileNumber) || "N/A",
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (admin) => (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${
            admin.isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full mr-1.5 ${
              admin.isActive ? "bg-green-600" : "bg-red-600"
            }`}
          ></span>
          {admin.isActive ? "Active" : "Inactive"}
        </div>
      ),
      sortable: true,
    },
  ];

  // Define actions for each row
  const actions: DataTableAction<Admin>[] = [
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4 mr-2" />,
      onClick: (admin) => navigate(`/admins/edit/${admin._id}`),
    },
    {
      label: (admin) => (admin.isActive ? "Deactivate" : "Activate"),
      icon: (admin) =>
        admin.isActive ? (
          <UserX className="h-4 w-4 mr-2" />
        ) : (
          <UserCheck className="h-4 w-4 mr-2" />
        ),
      onClick: handleToggleStatus,
      variant: "outline",
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      onClick: handleDeleteAdmin,
      variant: "destructive",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admins
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage admin accounts in your system
          </p>
        </div>

        <Button
          className="flex items-center gap-2 self-start text-white"
          onClick={() => navigate("/users/create")}
        >
          <Plus className="h-4 w-4" /> Add Admin
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search admins..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Admins Table */}
      <DataTable
        columns={columns}
        data={filteredAdmins}
        actions={actions}
        keyField="_id"
        isLoading={isLoading}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
};

export default AdminsList;
