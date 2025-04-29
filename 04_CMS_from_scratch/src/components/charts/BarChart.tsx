import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Monthly Revenue",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data = {
  labels,
  datasets: [
    {
      label: "Revenue 2023",
      data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
    {
      label: "Revenue 2024",
      data: [15000, 22000, 18000, 28000, 25000, 32000, 30000],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

export default function BarChart() {
  return <Bar options={options} data={data} />;
}
