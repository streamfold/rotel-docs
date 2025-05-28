import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData, // Import ChartData type from Chart.js
  ChartOptions, // Import ChartOptions type from Chart.js
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define the structure for the data prop more specifically if needed,
// or use ChartData directly from 'chart.js' as imported above.
// This is an example matching the one used in index.tsx previously for consistency.
interface CustomChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string | string[];
  borderWidth: number;
}

export interface BenchmarkChartData { // Renamed to avoid conflict with Chart.js's ChartData if imported directly
  labels: string[];
  datasets: CustomChartDataset[];
}

// Define props for the BenchmarkChart component
interface BenchmarkChartProps {
  data: BenchmarkChartData; // Use the specific data structure
  options?: ChartOptions<'bar'>; // Use Chart.js's ChartOptions, specify 'bar' type
  title: string;
}

export default function BenchmarkChart({ data, options, title }: BenchmarkChartProps): JSX.Element {
  const defaultChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // Good for fitting into columns
    plugins: {
      legend: {
        position: 'top' as const, // Use 'as const' for literal types
      },
      title: {
        display: true,
        text: title,
        font: {
            size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    ...options, // Allow user-provided options to override defaults
  };

  return (
    // It's good practice to wrap the chart in a div that can control its relative size
    <div style={{ height: '300px', position: 'relative' }}> {/* Ensure position relative for canvas */}
      <Bar data={data as ChartData<'bar', number[], string>} options={defaultChartOptions} /> {/* Cast data if its structure slightly differs from Chart.js's default ChartData */}
    </div>
  );
}
