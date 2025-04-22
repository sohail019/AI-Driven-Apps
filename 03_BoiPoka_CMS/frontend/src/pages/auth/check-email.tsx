import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CheckEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resetUrl = location.state?.resetUrl;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center">Check Your Email</h1>
          <p className="mt-4 text-center">
            A password reset email has been sent to your email address. Please
            check your inbox and follow the instructions to reset your password.
          </p>
          {resetUrl && (
            <div className="mt-4">
              <p className="text-center">
                For testing purposes, you can use the following URL to reset
                your password:
              </p>
              <p className="mt-2 text-center text-blue-500 break-words">
                {resetUrl}
              </p>
            </div>
          )}
          <Button
            className="mt-6 w-full"
            onClick={() => navigate("/admin-login")}
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckEmail;
