import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
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

interface BarChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
  className?: string;
  horizontal?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  className,
  horizontal,
}) => {
  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? "y" : "x",
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          bottom: 20,
        },
        color: "#374151",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#f3f4f6",
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "#6b7280",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "#6b7280",
        },
      },
    },
  };

  return (
    <div className={`chart-container h-80 ${className || ""}`}>
      <Bar options={options} data={data} />
    </div>
  );
};
