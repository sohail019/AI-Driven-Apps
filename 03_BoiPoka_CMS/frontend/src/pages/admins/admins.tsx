import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, XCircle, AlertCircle } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/shared/table/data-table";
import { CellActionAdmin } from "@/components/admins/cell-action-admin";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useNavigate } from "react-router";
import { useEffect, useState, useCallback } from "react";
import { Admin as BaseAdmin } from "@/constants/data";
import axiosInstance from "@/utils/axios-instance";
import { toast } from "sonner";

// Extend the base Admin type with additional fields
interface Admin extends BaseAdmin {
  role: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
  mobile?: string;
}

export default function AdminsPage() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch admins from API
  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/super-admin/admins");
      // Ensure we have data and it's an array before setting state
      if (response.data?.admins && Array.isArray(response.data.admins)) {
        setAdmins(response.data.admins);
      } else {
        // Set empty array if response format is not as expected
        setAdmins([]);
        console.warn("Invalid response format:", response.data);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch admins";
      setError(errorMessage);
      console.error("Error fetching admins:", errorMessage);
      toast.error("Failed to fetch admins");
      // Ensure we set an empty array on error
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const columns: ColumnDef<Admin>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Full Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "mobile",
      header: "Mobile Number",
    },
    {
      accessorKey: "accessTo",
      header: "Privileges",
      cell: ({ row }) => {
        const accessTo = row.original?.accessTo || [];

        const privilegeMapping = {
          "get-user": "Get",
          "deactivate-user": "Deactivate",
          "activate-user": "Activate",
          "get-book": "Get Book",
          "update-userbooks": "Update Userbook",
          genre: "Genre",
          "delete-userbooks": "Delete Userbook",
          "get-userbooks": "Get Userbook",
        };

        const privilegeOrder = [
          "get-user",
          "deactivate-user",
          "activate-user",
          "get-book",
          "update-userbooks",
          "delete-userbooks",
          "get-userbooks",
          "genre",
        ];

        const sortedAccessTo = accessTo.length
          ? accessTo.sort(
              (a, b) => privilegeOrder.indexOf(a) - privilegeOrder.indexOf(b)
            )
          : [];

        const displayedPrivileges = sortedAccessTo.slice(0, 3);
        const remainingPrivileges = sortedAccessTo.slice(3);

        return (
          <div className="flex space-x-2 items-center">
            {displayedPrivileges.map((privilege, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800"
              >
                {privilegeMapping[privilege as keyof typeof privilegeMapping] ||
                  privilege.replace("-", " ").toUpperCase()}
              </span>
            ))}
            {remainingPrivileges.length > 0 && (
              <HoverCard>
                <HoverCardTrigger>
                  <span className="px-2 py-1 cursor-pointer underline text-xs rounded-full bg-gray-200 text-blue-800">
                    +{remainingPrivileges.length}
                  </span>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex flex-wrap gap-2 p-2">
                    {remainingPrivileges.map((privilege, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                      >
                        {privilegeMapping[
                          privilege as keyof typeof privilegeMapping
                        ] || privilege.replace("-", " ").toUpperCase()}
                      </span>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        );
      },
    },

    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original?.isActive;
        return (
          <div className="px-3">
            {status ? (
              <CheckCircle className="text-green-500 w-5 h-5" />
            ) : (
              <XCircle className="text-red-500 w-5 h-5" />
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <CellActionAdmin data={row.original} refreshData={fetchAdmins} />
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-2 py-5">
        <div className="flex gap-3">
          <Button
            onClick={() => {
              navigate("/create-admin");
            }}
            className="text-xs md:text-sm"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Admin
          </Button>
        </div>
      </div>
      {error && (
        <div className="flex items-center p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <p>Loading admins...</p>
        </div>
      ) : (
        <DataTable columns={columns} data={admins || []} />
      )}
    </div>
  );
}
