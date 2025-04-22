import { useSelector } from "react-redux";
import { useRouter } from "@/routes/hooks";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store";

export default function UnauthorizedPage() {
  const { isAuthenticated, userType } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const getLoginPath = () => {
    if (userType === "Admin") return "/admin-login";
    if (userType === "SuperAdmin") return "/superadmin-login";
    return "/login"; 
  };

  //? Redirect the user to their dashboard if authenticated, otherwise to the login page
  const handleButtonClick = () => {
    if (isAuthenticated) {
        router.push("/dashboard");
    //   if (userType === "Admin") {
    //   } else if (userType === "SuperAdmin") {
    //     router.push("/dashboard");
    //   } else {
    //     router.push("/dashboard"); 
    //   }
    } else {
      router.push(getLoginPath());
    }
  };

  return (
    <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        401
      </span>
      <h2 className="font-heading my-2 text-2xl font-bold">
        Unauthorized Access
      </h2>
      <p>Sorry, you do not have permission to view this page.</p>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={handleButtonClick} variant="ghost" size="lg">
          {isAuthenticated ? "Go to Dashboard" : "Go to Login"}
        </Button>
      </div>
    </div>
  );
}
