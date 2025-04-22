import PopupModal from "@/components/shared/popup-modal";
import TableSearchInput from "@/components/shared/table-search-input";
import { Button } from "@/components/ui/button";
import UserCreateForm from "../users-forms/users-create-form";
import { DownloadIcon } from "lucide-react";

export default function UserTableActions() {
  return (
    <div className="flex items-center justify-between py-5">
      <div className="flex flex-1 gap-4">
        <TableSearchInput placeholder="Search People Here" />
      </div>
      <div className="flex gap-3">
        <Button>
          <DownloadIcon className="h-6 w-6" />
          Download CSV
        </Button>

        <PopupModal
          renderModal={(onClose) => <UserCreateForm modalClose={onClose} />}
        />
      </div>
    </div>
  );
}
