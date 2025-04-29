import { useState } from "react";
import { Button } from "./ui/button";
import LineChart from "./charts/LineChart";
import BarChart from "./charts/BarChart";
import PieChart from "./charts/PieChart";
import { useTranslation } from "react-i18next";

type ChartType = "line" | "bar" | "pie";

export default function ChartTabs() {
  const { t } = useTranslation();
  const [activeChart, setActiveChart] = useState<ChartType>("line");

  const renderChart = () => {
    switch (activeChart) {
      case "line":
        return <LineChart />;
      case "bar":
        return <BarChart />;
      case "pie":
        return <PieChart />;
      default:
        return <LineChart />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button
          variant={activeChart === "line" ? "default" : "outline"}
          onClick={() => setActiveChart("line")}
          className="bg-blue-500 text-white"
        >
          {t("charts.line")}
        </Button>
        <Button
          variant={activeChart === "bar" ? "default" : "outline"}
          onClick={() => setActiveChart("bar")}
          className="bg-blue-500 text-white"
        >
          {t("charts.bar")}
        </Button>
        <Button
          variant={activeChart === "pie" ? "default" : "outline"}
          onClick={() => setActiveChart("pie")}
          className="bg-blue-500 text-white"
        >
          {t("charts.pie")}
        </Button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow w-full">
        {renderChart()}
      </div>
    </div>
  );
}
