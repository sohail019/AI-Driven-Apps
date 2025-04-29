import { useState } from "react";
import { BookOpen } from "lucide-react";

interface BookCoverProps {
  src: string;
  alt: string;
  className?: string;
}

export default function BookCover({
  src,
  alt,
  className = "",
}: BookCoverProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded ${className}`}
      >
        <BookOpen className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover rounded ${className}`}
      onError={() => setImageError(true)}
    />
  );
}
