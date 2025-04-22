import { useEffect, useState } from "react";
import { Book } from "@/constants/data";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/table/data-table";
import { DataTablePagination } from "@/components/shared/table/data-table-pagination";
import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";
import { booksColumns } from "./book-column";
import { Table, Updater } from "@tanstack/react-table";
import axiosInstance from "@/utils/axios-instance";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalBooks, setTotalBooks] = useState(0);
  const { toast } = useToast();

  const fetchBooks = async (page: number, limit: number, title?: string) => {
    try {
      setLoading(true);

      // Call the API
      const response = await axiosInstance.get("/admin/books", {
        params: { page, limit, title },
      });

      // Extract books from the response
      const responseData = response.data;
      if (!responseData || !responseData.books) {
        throw new Error("Invalid response format");
      }

      // Map the books and set state
      const booksList = responseData.books;
      setBooks(booksList.map((book: Book) => ({ ...book, id: book._id })));

      // Set total count - either from API or use the array length
      setTotalBooks(responseData.total || booksList.length);
      setError(null);
    } catch (error: unknown) {
      setError("Failed to fetch books");
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch books";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch books on initial load and when page/size change
  useEffect(() => {
    fetchBooks(currentPage, pageSize, searchQuery);
  }, [currentPage, pageSize]);

  // Handle search with debounce
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      // Reset to first page when searching
      setCurrentPage(1);
      fetchBooks(1, pageSize, searchQuery);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="p-4 space-y-4">
      <Input
        placeholder="Search books..."
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {loading ? (
        <DataTableSkeleton columnCount={6} rowCount={10} />
      ) : books.length === 0 ? (
        <p className="text-center text-gray-500">No books found.</p>
      ) : (
        <div className="space-y-4">
          <DataTable columns={booksColumns} data={books} />
          <DataTablePagination
            table={
              {
                getState: () => ({
                  pagination: { pageIndex: currentPage - 1, pageSize },
                }),
                getPageCount: () => Math.ceil(totalBooks / pageSize),
                getCanNextPage: () =>
                  currentPage < Math.ceil(totalBooks / pageSize),
                getCanPreviousPage: () => currentPage > 1,
                nextPage: () => handlePageChange(currentPage + 1),
                previousPage: () => handlePageChange(currentPage - 1),
                setPageSize: (updater: Updater<number>) => {
                  const size =
                    typeof updater === "function" ? updater(pageSize) : updater;
                  handlePageSizeChange(Number(size));
                },
                setPageIndex: (updater: Updater<number>) => {
                  const index =
                    typeof updater === "function"
                      ? updater(currentPage - 1)
                      : updater;
                  handlePageChange(Number(index) + 1);
                },
              } as Table<Book>
            }
          />
        </div>
      )}
    </div>
  );
}
