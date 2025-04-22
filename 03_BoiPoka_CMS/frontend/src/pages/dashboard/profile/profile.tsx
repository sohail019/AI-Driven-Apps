import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [adminDetails, setAdminDetails] = useState({
    image: "/public/logo.svg",
    name: "Admin",
    email: "admin@example.com",
    role: "Administrator",
    mobileNumber: "1234567890",
  });

  useEffect(() => {}, []);

  const handleUpdateProfile = () => {
    navigate("/profile-update");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <div className="container p-3 max-w-lg">
      <Card>
        <CardContent>
          <div className="flex flex-col space-y-6">
            {/* <img
              src={adminDetails.image}
              alt="Admin"
              className="w-32 h-12 pt-3 border-gray-300"
            /> */}
            <div>
              <div className="grid grid-cols-2 p-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Name:</p>
                  <p className="text-sm text-gray-500 font-semibold">
                    {adminDetails.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email:</p>
                  <p className="text-sm text-gray-500">{adminDetails.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Role:</p>
                  <p className="text-sm text-gray-500">{adminDetails.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Mobile Number:
                  </p>
                  <p className="text-sm text-gray-500">
                    {adminDetails.mobileNumber}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleUpdateProfile} className="w-34">
                Update Profile
              </Button>
              <Button onClick={handleChangePassword} className="w-34">
                Change Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Outlet />
    </div>
  );
};

export default ProfilePage;
