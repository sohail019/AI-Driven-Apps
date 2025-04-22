import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaBook, FaHeadphones } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { BookAudio, BookDown, BookHeart } from "lucide-react";
import axiosInstance from "@/utils/axios-instance";

interface Distribution {
  count: number;
  type?: string;
  sourceName?: string;
}

export default function BookSourceDistribution() {
  const [bookTypeDistribution, setBookTypeDistribution] = useState<
    Distribution[]
  >([]);
  const [sourceNameDistribution, setSourceNameDistribution] = useState<
    Distribution[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistribution = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/book-source-distribution");
        console.log("Response:", response.data);
      } catch (error) {
        // setError("Failed to fetch distribution data", error);
        console.log("Error:", error);
      }
    };

    fetchDistribution();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const typeIconMap: Record<string, JSX.Element> = {
    eBook: <FiFileText size={32} />,
    Audible: <FaHeadphones size={32} />,
    audioBook: <BookAudio size={32} />,
    physicalBook: <BookHeart size={32} />,
    Physical: <BookHeart size={32} />,
    Kindle: <BookDown size={32} />,
    Default: <FaBook size={32} />,
  };

  const typeDisplayNameMap: Record<string, string> = {
    eBook: "E Book",
    audioBook: "Audio Book",
    physicalBook: "Physical Book",
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Book Type Distribution Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Book Type Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around pt-6">
          {bookTypeDistribution.map((item, index) => (
            <div
              key={`type-${index}`}
              className="flex flex-col items-center space-y-2"
            >
              <div>{typeIconMap[item.type || "Default"]}</div>
              <p className="text-sm font-medium text-center">
                {typeDisplayNameMap[item.type || "Other"]}
              </p>
              <p className="text-2xl font-bold">{item.count}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Source Name Distribution Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Source Name Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around pt-6">
          {sourceNameDistribution.map((item, index) => (
            <div
              key={`type-${index}`}
              className="flex flex-col items-center space-y-2"
            >
              <div>{typeIconMap[item.sourceName || "Default"]}</div>
              <p className="text-sm font-medium text-center">
                {item.sourceName || "Other"}
              </p>
              <p className="text-2xl font-bold">{item.count}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
