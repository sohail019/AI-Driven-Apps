import DataTable from "@/components/shared/data-table";
import { columns } from "./columns";
import UserTableActions from "./user-table-actions";

type TUsersTableProps = {
  users: any;
  page: number;
  totalUsers: number;
  pageCount: number;
};

export default function UserFeedTable({
  users,
  pageCount,
}: TUsersTableProps) {
  return (
    <>
      <UserTableActions />
      {users && (
        <DataTable columns={columns} data={users} pageCount={pageCount} />
      )}
    </>
  );
}
