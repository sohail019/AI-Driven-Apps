import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { dashboardAPI, TopBook } from "../../lib/api/dashboardApi";
import { useToast } from "../../hooks/useToast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

const TopBooks = () => {
  const { error } = useToast();
  const [books, setBooks] = useState<TopBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardAPI.getTopBooks();

        setBooks(data);
      } catch (err) {
        console.error("Error fetching top books:", err);
        error("Failed to load top books");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!books || books.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Top 5 Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            No books data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Top 5 Books</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {books.map((book) => (
            <div key={book._id} className="flex items-center gap-4">
              <Avatar className="h-12 w-12 bg-gray-200 dark:bg-gray-700">
                <AvatarImage
                  src={book.coverImage}
                  alt={book.title}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                  {book.title.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{book.title}</p>
                <p className="text-sm text-gray-500 truncate">
                  {book.author.join(", ")}
                </p>
              </div>
              <Badge
                variant="secondary"
                className="bg-gray-200 dark:bg-gray-700"
              >
                {book.count}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopBooks;
