import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FlattenedData } from "../cache/analytics-cache";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({
  analyticsData,
}: {
  analyticsData: FlattenedData[] | null;
}) {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const backgroundColor: string[] = [
    "rgba(160,32,240, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 99, 132, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(160,32,240, 0.2)",
  ];

  const borderColor: string[] = [
    "rgba(160,32,240, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(160,32,240, 1)",
  ];

  const chartData = {
    labels: analyticsData?.map((item) => item.dimensionValue),
    datasets: [
      {
        label: "Visitors",
        data: analyticsData?.map((item) => parseInt(item.metricValue, 10)),
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: any = {
    type: "bar",
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    indexAxis: isMobile ? "y" : "x",
    maintainAspectRatio: false,
    responsive: true,
    aspectRatio: 1,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },

  };

  return <Bar data={chartData} options={chartOptions} />;
}
