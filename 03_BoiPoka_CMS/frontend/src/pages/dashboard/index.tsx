import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Overview from "@/components/dashboard/components/overview";
import PopularGenre from "@/components/dashboard/components/popular-genre";
import { Button } from "@/components/ui/button";
import Stats from "@/components/dashboard/components/stats";
import { AccessControl } from "@/components/dashboard/components/access-control";
import TopFiveBooks from "../../components/dashboard/components/top-five-books";
import UsersPage from "../users/users";
import BookSourceDistribution from "@/components/dashboard/components/book-source-distribution";

export default function DashboardPage() {
  return (
    <>
      <div className="flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome to Boipoka CMS 👋
          </h2>
        </div>
        <Stats />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Most Popular Genres</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <PopularGenre />
            </CardContent>
          </Card>
          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Top 5 Books</CardTitle>
              <CardDescription>
                Here are the top 5 books this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopFiveBooks />
            </CardContent>
          </Card>
        </div>
        <BookSourceDistribution />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Book Categories Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Access Control Management</CardTitle>
            </CardHeader>
            <CardContent>
              <AccessControl />
            </CardContent>
          </Card>
        </div>
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex flex-row justify-between items-center">
                  <span>Recently Added Users</span>
                  <Button>All Users</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UsersPage />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
