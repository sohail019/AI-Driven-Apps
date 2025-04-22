import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axiosInstance from "@/utils/axios-instance";

interface Book {
  bookId: string;
  title: string;
  author: string;
  count: number;
}

export default function TopFiveBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get("/admin/getTopFiveBooks");
        const fetchedBooks: Book[] = response.data.data.topBooks;
        setBooks(fetchedBooks);
      } catch (err) {
        setError("Failed to fetch top books.");
        console.error("Error fetching top books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopBooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8 overflow-auto">
      {books.map((book, index) => (
        <div className="flex items-center" key={book.bookId}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/${index + 1}.png`} alt={book.title} />
            <AvatarFallback>
              {book.title.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{book.title}</p>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
          <div className="ml-auto font-medium text-sm">Reads: {book.count}</div>
        </div>
      ))}
    </div>
  );
}
