import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ title, data, className }) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
        color: '#374151',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
        },
        border: {
          dash: [5, 5],
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#6b7280',
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
          color: '#6b7280',
        },
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  return (
    <div className={`chart-container h-80 ${className || ''}`}>
      <Line options={options} data={data} />
    </div>
  );
};