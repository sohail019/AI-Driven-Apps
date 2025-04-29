import { useTranslation } from "react-i18next";
import ChartTabs from "../components/ChartTabs";

export default function ChartPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm ">
      <h1 className="text-2xl font-bold mb-6">{t("charts.title")}</h1>
      <ChartTabs />
    </div>
  );
}
