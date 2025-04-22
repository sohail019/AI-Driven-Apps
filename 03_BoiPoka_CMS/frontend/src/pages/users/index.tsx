import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import UsersTable from "@/components/users/users-table";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { getStudents } from "@/lib/api";

export default function UserPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const pageLimit = Number(searchParams.get("limit") || 10);
  const offset = (page - 1) * pageLimit;
  const token = useSelector((state: RootState) => state.auth.token) as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStudents(offset, pageLimit, token);
      setData(response);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [offset, pageLimit, token]);

  // Real-time updates using polling or WebSocket (optional)
  useEffect(() => {
    const interval = setInterval(fetchData, 60000); // Poll every 60 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [offset, pageLimit, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const users = data?.users || [];
  const totalUsers = data?.total_users || 0;
  const pageCount = Math.ceil(totalUsers / pageLimit);

  return (
    <div className="p-4 md:p-8">
      <UsersTable
        users={users}
        page={page}
        totalUsers={totalUsers}
        pageCount={pageCount}
      />
    </div>
  );
}
