import DataTable from "@/components/shared/data-table";
import { columns } from "./columns";
import UserTableActions from "./user-table-action";

type TUsersTableProps = {
  users: any;
  page: number;
  totalUsers: number;
  pageCount: number;
};

export default function UsersTable({ users, pageCount }: TUsersTableProps) {
  return (
    <>
      <UserTableActions />
      {users && (
        <DataTable columns={columns} data={users} pageCount={pageCount} />
      )}
    </>
  );
}
