import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Define the structure for line chart datasets
interface CustomLineDataset {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    borderWidth?: number;
    fill?: boolean;
    tension?: number; // For curve smoothness
    pointRadius?: number;
    pointHoverRadius?: number;
}

export interface LineChartData {
    labels: string[];
    datasets: CustomLineDataset[];
}

// Define props for the LineChart component
interface LineChartProps {
    data: LineChartData;
    options?: ChartOptions<'line'>;
    title: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
}

export default function LineChart({
                                      data,
                                      options,
                                      title,
                                      xAxisLabel = 'X Axis',
                                      yAxisLabel = 'Y Axis'
                                  }: LineChartProps): JSX.Element {
    const defaultChartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                display: true,
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
            x: {
                display: true,
                title: {
                    display: true,
                    text: xAxisLabel,
                    font: {
                        size: 14
                    }
                },
            },
            y: {
                display: true,
                beginAtZero: true,
                title: {
                    display: true,
                    text: yAxisLabel,
                    font: {
                        size: 14
                    }
                },
            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        hover: {
            mode: 'nearest' as const,
            intersect: true,
        },
        ...options, // Allow user-provided options to override defaults
    };

    return (
        <div style={{ height: '400px', position: 'relative' }}>
            <Line
                data={data as ChartData<'line', number[], string>}
                options={defaultChartOptions}
            />
        </div>
    );
}
