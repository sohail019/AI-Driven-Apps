import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { booksAPI, Book } from "../../lib/api/books";
import {
  DataTable,
  DataTableColumn,
} from "../../components/ui/data-table/DataTable";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Search } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/ui/hover-card";

const BooksPage = () => {
  const navigate = useNavigate();
  const { error } = useToast();

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const data = await booksAPI.getBooks({
        page: currentPage,
        limit: 10,
        title: searchTerm,
      });

      if (data) {
        setBooks(data.books);
        setTotalPages(Math.ceil(data.total / 10));
      } else {
        setBooks([]);
        setTotalPages(1);
        error("Failed to load books");
      }
    } catch (err) {
      console.error("Error fetching books:", err);
      error("Failed to load books");
      setBooks([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleImageClick = (imageUrl: string) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setIsImageModalOpen(true);
    } else {
      error("No image found");
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const renderBadgeWithCount = (
    items: string[],
    maxVisible: number = 1,
    fallbackText: string
  ) => {
    if (!items || items.length === 0) {
      return (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {fallbackText}
        </div>
      );
    }

    const visibleItems = items.slice(0, maxVisible);
    const remainingCount = items.length - maxVisible;

    return (
      <div className="flex items-center gap-1">
        {visibleItems.map((item, index) => (
          <Badge key={index} variant="secondary">
            {item}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <HoverCard>
            <HoverCardTrigger>
              <Badge variant="outline">+{remainingCount}</Badge>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="space-y-1">
                {items.slice(maxVisible).map((item, index) => (
                  <p key={index} className="text-sm">
                    {item}
                  </p>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
    );
  };

  const renderISBN = (isbns: string[]) => {
    if (!isbns || isbns.length === 0) {
      return (
        <div className="text-sm text-gray-500 dark:text-gray-400">No ISBN</div>
      );
    }

    const firstISBN = isbns[0];
    const remainingCount = isbns.length - 1;

    return (
      <div className="flex items-center gap-1">
        <Badge variant="secondary">{firstISBN}</Badge>
        {remainingCount > 0 && (
          <HoverCard>
            <HoverCardTrigger>
              <Badge variant="outline">+{remainingCount}</Badge>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="space-y-1">
                {isbns.slice(1).map((isbn, index) => (
                  <p key={index} className="text-sm">
                    {isbn}
                  </p>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
    );
  };

  // Define columns for the data table
  const columns: DataTableColumn<Book>[] = [
    {
      id: "ISBN",
      header: "ISBN",
      cell: (book) => renderISBN(book.ISBN),
    },
    {
      id: "coverImage",
      header: "Cover",
      cell: (book) => (
        <div
          className="w-16 h-16 cursor-pointer"
          onClick={() => handleImageClick(book.coverImage)}
        >
          <img
            src={
              book.coverImage
                ? book.coverImage
                : "https://miro.medium.com/v2/resize:fit:1400/1*s_BUOauMhzRZL0dBiCExww.png"
            }
            alt={book.title}
            className="w-full h-full object-cover rounded"
          />
        </div>
      ),
    },
    {
      id: "title",
      header: "Title",
      cell: (book) => book.title || "No title",
      sortable: true,
    },
    {
      id: "description",
      header: "Description",
      cell: (book) => (
        <HoverCard>
          <HoverCardTrigger>
            <p className="cursor-pointer">
              {book.description
                ? truncateText(book.description, 50)
                : "No description"}
            </p>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm">
              {book.description
                ? truncateText(book.description, 220)
                : "No description"}
            </p>
          </HoverCardContent>
        </HoverCard>
      ),
    },
    {
      id: "genre",
      header: "Genre",
      cell: (book) => renderBadgeWithCount(book.genre, 1, "No genre"),
    },
    {
      id: "author",
      header: "Author",
      cell: (book) => renderBadgeWithCount(book.author, 1, "No author"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
            Books
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your book collection
          </p>
        </div>
        {/* <Button onClick={() => navigate("/books/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button> */}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={books}
        isLoading={isLoading}
        keyField="_id"
        pagination={{
          currentPage,
          totalPages,
          onPageChange: handlePageChange,
        }}
      />

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Book Cover</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-[3/4] w-full">
            <img
              src={selectedImage}
              alt="Book cover"
              className="w-full h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BooksPage;
