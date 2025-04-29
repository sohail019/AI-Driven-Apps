import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  dashboardAPI,
  type GenreDistribution as GenreDistributionType,
} from "../../lib/api/dashboardApi";
import { useToast } from "../../hooks/useToast";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
];

const GenreDistribution = () => {
  const { error } = useToast();
  const [data, setData] = useState<GenreDistributionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genreData = await dashboardAPI.getGenreDistribution();
        // Filter out null or "Others" categories and sort by count
        const filteredData = genreData
          .filter((item) => item.genre && item.genre !== "Others")
          .sort((a, b) => b.count - a.count);
        console.log(filteredData);
        setData(filteredData);
      } catch (err) {
        console.error("Error fetching genre distribution:", err);
        error("Failed to load genre distribution");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data.map((item) => item.genre),
    datasets: [
      {
        data: data.map((item) => item.count),
        backgroundColor: COLORS,
        borderColor: COLORS.map((color) => color + "80"),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"pie">) => {
            const label = context.label || "";
            const value = context.raw as number;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(0);
            return `${label}: ${value} books (${percentage}%)`;
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Genre Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No genre data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Genre Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default GenreDistribution;
