import { DataTable } from "@/components/shared/table/data-table";
import { DataTablePagination } from "@/components/shared/table/data-table-pagination";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CellActionUser } from "@/components/users/cell-action-user";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface User {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  userBookCount: number;
  isActive: boolean;
}

export default function UsersPage() {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);

  const columns: ColumnDef<User>[] = [
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
      accessorKey: "mobileNumber",
      header: "Mobile Number",
      cell: ({ row }) => {
        const mobileNumber = row.original.mobileNumber;
        return (
          <div>
            {mobileNumber ? <p> {mobileNumber} </p> : <p className="px-8">-</p>}
          </div>
        );
      },
    },
    {
      accessorKey: "userBookCount",
      header: "User Book Count",
      cell: ({ row }) => {
        const userBookCount = row.original.userBookCount;
        return (
          <div className="px-12">
            {userBookCount ? <p> {userBookCount} </p> : <p>-</p>}
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.isActive;
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
      cell: ({ row }) => <CellActionUser data={row.original} />,
    },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/users", {
        params: {
          page,
          pageSize,
          search: searchQuery,
        },
      });

      setUsers(response.data.users);
      setTotalUsers(response.data.total_users);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Input
        placeholder="Search users..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={users} />
        </div>
        <DataTablePagination
          table={{
            getState: () => ({
              pagination: { pageIndex: page - 1, pageSize },
              columnVisibility: {},
              columnOrder: [],
              columnPinning: {},
              rowPinning: {},
              sorting: [],
              globalFilter: "",
              columnFilters: [],
              columnSizing: {},
              columnSizingInfo: {
                isResizingColumn: false,
                startOffset: 0,
                startSize: 0,
              },
              expanded: {},
              grouping: [],
              selectedRowIds: {},
              rowSelection: {},
            }),
            getPageCount: () => Math.ceil(totalUsers / pageSize),
            getCanNextPage: () => page < Math.ceil(totalUsers / pageSize),
            getCanPreviousPage: () => page > 1,
            nextPage: () => {
              const newPage = page + 1;
              window.history.pushState(
                {},
                "",
                `/users?page=${newPage}&pageSize=${pageSize}`
              );
            },
            previousPage: () => {
              const newPage = page - 1;
              window.history.pushState(
                {},
                "",
                `/users?page=${newPage}&pageSize=${pageSize}`
              );
            },
            setPageSize: (size: number) => {
              window.history.pushState(
                {},
                "",
                `/users?page=${page}&pageSize=${size}`
              );
            },
            setPageIndex: (index: number) => {
              window.history.pushState(
                {},
                "",
                `/users?page=${index + 1}&pageSize=${pageSize}`
              );
            },
            getFilteredSelectedRowModel: () => ({ rows: [] }),
            getFilteredRowModel: () => ({ rows: [] }),
          }}
        />
      </div>
    </div>
  );
}
