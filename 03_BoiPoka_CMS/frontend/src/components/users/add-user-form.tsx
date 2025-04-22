import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AddUserForm = () => {
  return (
    <form onSubmit={() => {}} className="space-y-6 text-sm">
      <div className="flex flex-col">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Add New User
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter the details of the new user below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="User Name"
                  // {...register("name")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user-email@example.com"
                  // {...register("email")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  // {...register("role")}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-transparent"
                  required
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="text"
                  placeholder="User Mobile Number"
                  // {...register("mobileNumber")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="User Location"
                  // {...register("location")}
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-4">
                Add User
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default AddUserForm;
