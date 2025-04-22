import TableSearchInput from "@/components/shared/table-search-input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserTableActions() {
  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate("/add-user");
  };

  return (
    <div className="flex items-center justify-between gap-2 py-5">
      <div className="flex flex-1 gap-4">
        <TableSearchInput placeholder="Search People Here" />
      </div>
      <div className="flex gap-3">
        <Button onClick={handleAddUser} className="text-xs md:text-sm">
          <Plus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>
    </div>
  );
}
