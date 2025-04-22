import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StopwatchIcon } from "@radix-ui/react-icons";
import { Edit, MoreHorizontal } from "lucide-react";

interface UserData {
  isActive: boolean;
  _id?: string;
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  userBookCount?: number;
}

interface CellActionUserProps {
  data: UserData;
}

export const CellActionUser: React.FC<CellActionUserProps> = ({ data }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" /> Update
        </DropdownMenuItem>
        <DropdownMenuItem>
          <StopwatchIcon className="mr-2 h-4 w-4" />{" "}
          {data.isActive ? "Deactivate" : "Activate"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
