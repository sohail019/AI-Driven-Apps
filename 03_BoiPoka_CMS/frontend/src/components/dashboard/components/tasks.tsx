import { z } from "zod";
import { columns } from "@/components/shared/table/columns";
import { DataTable } from "@/components/shared/table/data-table";
import { taskSchema } from "@/constants/tasks/schema";
import tasksData from "@/constants/tasks/tasks.json";
import { useEffect, useState } from "react";
import { Book } from "@/constants/data";
import axiosInstance from "@/utils/axios-instance";
import { useToast } from "@/hooks/use-toast";
import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";
import { booksColumns } from "@/pages/books/book-column";

const tasks = z.array(taskSchema).parse(tasksData);

export default function TaskTable() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/admin/getAllBooks");
        setBooks(
          response.data.data.books.map((book: Book) => ({
            ...book,
            id: book._id,
          }))
        );
        setError(null);
      } catch (error: any) {
        setError(error.message || "Failed to fetch books.");
        toast({
          title: "Error",
          description: error.message || "Failed to fetch books.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [toast]);
  return (
    <>
      <div className="md:hidden">
        {/* <img
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Tasks"
          className="block dark:hidden"
        />
        <img
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Tasks"
          className="hidden dark:block"
        /> */}
      </div>
      <div className="hidden md:block">
        {loading ? (
          <DataTableSkeleton columnCount={7} rowCount={10} />
        ) : books.length === 0 ? (
          <p className="text-center text-gray-500">No books found.</p>
        ) : (
          <DataTable columns={booksColumns} data={books} />
        )}
        <DataTable columns={columns} data={tasks} />
      </div>
    </>
  );
}
