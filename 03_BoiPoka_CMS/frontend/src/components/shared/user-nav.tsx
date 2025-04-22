import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { updateAdminInfo } from "@/store/slices/auth-slice";
import { logout } from "@/store/slices/auth-slice";
import { RootState } from "@/store";

export default function UserNav() {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { adminInfo } = useSelector((state: RootState) => state.auth);

  // Ensure adminInfo is loaded from localStorage on page refresh
  useEffect(() => {
    const savedAdminInfo = localStorage.getItem("adminInfo");
    if (savedAdminInfo) {
      dispatch(updateAdminInfo(JSON.parse(savedAdminInfo)));
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigateTo("/login");
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-14 w-14 rounded-full">
            <Avatar className="h-14 w-14">
              <AvatarImage
                src={
                  "https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png"
                }
                alt="Avatar"
              />
              <AvatarFallback>
                {adminInfo?.fullName?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {adminInfo?.fullName || "Admin"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {adminInfo?.email || "admin@example.com"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {/* <DropdownMenuItem
              onSelect={() => {
                navigateTo("/profile");
              }}
            >
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem> */}
            <DropdownMenuItem
              onSelect={() => {
                navigateTo("/users");
              }}
            >
              List User
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              handleLogout();
            }}
          >
            Logout
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
