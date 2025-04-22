import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA00FF",
  "#FF00AA",
  "#FF6347",
  "#7CFC00",
  "#6A5ACD",
  "#FFD700",
];

const chartConfig = {
  genres: {
    label: "Genres",
    color: COLORS[0],
  },
} satisfies ChartConfig;

const PopularGenre = () => {
  const chartData = [
    { name: "Fiction", value: 400 },
    { name: "Non-Fiction", value: 300 },
    { name: "Science", value: 200 },
    { name: "History", value: 100 },
  ];

  return (
    <div className="p-4 rounded-lg shadow-md">
      <ChartContainer config={chartConfig}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="80%"
            labelLine={false}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default PopularGenre;
