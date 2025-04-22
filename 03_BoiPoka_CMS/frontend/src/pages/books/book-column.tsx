import { ColumnDef } from "@tanstack/react-table";
import { HoverableTagList } from "@/components/shared/hoverable-tag-list";
import { Book } from "@/constants/data";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useState } from "react";

export const truncateText = (text: string, length: number) =>
  text.length > length ? `${text.substring(0, length)}...` : text;

export const booksColumns: ColumnDef<Book>[] = [
  {
    id: "srNo",
    header: "Sr. No",
    cell: ({ row }) => <span className="pl-2">{row.index + 1}</span>,
  },
  {
    accessorKey: "isbn",
    header: "ISBN",
    cell: ({ row }) => {
      const isbnList = Array.isArray(row.original.isbn)
        ? row.original.isbn
        : [];
      return isbnList?.length > 1 ? (
        <HoverableTagList items={isbnList} visibleCount={1} />
      ) : (
        <span>{isbnList?.length === 1 ? isbnList[0] : "-"}</span>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "description",
    header: "Short Description",
    cell: ({ row }) => {
      const description =
        row.original.bookData?.description ||
        row.original.description ||
        "No Description";

      return description === "No Description" ? (
        <span className="truncate max-w-xs">{description}</span>
      ) : (
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className="truncate max-w-xs cursor-pointer underline">
              {truncateText(description, 50)}
            </span>
          </HoverCardTrigger>
          <HoverCardContent
            side="top"
            align="center"
            className="p-3 md:w-[340px] bg-white border border-gray-300 rounded-md shadow-md"
          >
            <p className="text-sm text-gray-700">
              {truncateText(description, 220)}
            </p>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "coverImage",
    header: "Cover Image",
    cell: ({ row }) => <CoverImageCell row={row} />,
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const authors = row.original.author;
      return authors?.length > 1 ? (
        <HoverableTagList items={authors} visibleCount={1} />
      ) : (
        <span>{authors?.length === 1 ? authors[0] : "No Author"}</span>
      );
    },
  },
  {
    accessorKey: "genre",
    header: "Genre",
    cell: ({ row }) => {
      const genres = row.original.genre;
      return genres?.length > 1 ? (
        <HoverableTagList items={genres} visibleCount={1} />
      ) : (
        <span>{genres?.length === 1 ? genres[0] : "No Genre"}</span>
      );
    },
  },
];

const CoverImageCell = ({ row }: { row: { original: Book } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <img
        src={row.original.coverImage || "logo.png"}
        alt={row.original.title || "Cover Image"}
        className="h-16 w-16 object-cover rounded-md cursor-pointer"
        onClick={handleOpen}
      />
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleClose}
        >
          <div className="relative">
            <img
              src={row.original.coverImage || "logo.png"}
              alt={row.original.title || "Cover Image"}
              className="max-h-full max-w-3xl object-cover rounded-md"
            />
            <button
              className="absolute top-2 right-2 text-white bg-black bg-opacity-75 rounded-full p-1"
              onClick={handleClose}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};
