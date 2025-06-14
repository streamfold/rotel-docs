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
    ChartData,
    ChartOptions,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Updated interface to better support individual bar colors
interface CustomChartDataset {
    label: string;
    data: number[];
    backgroundColor: string | string[]; // Array of colors for individual bars
    borderColor: string | string[];     // Array of border colors for individual bars
    borderWidth: number;
}

export interface BarChartData {
    labels: string[];
    datasets: CustomChartDataset[];
}

interface BenchmarkChartProps {
    data: BarChartData;
    options?: ChartOptions<'bar'>;
    title: string;
}

// Helper function to generate colors for bars
export function generateBarColors(
    dataLength: number,
    colorGroups: { color: string; count: number }[]
): string[] {
    const colors: string[] = [];
    let currentIndex = 0;

    for (const group of colorGroups) {
        for (let i = 0; i < group.count && currentIndex < dataLength; i++) {
            colors.push(group.color);
            currentIndex++;
        }
    }

    // Fill remaining with the last color if needed
    while (colors.length < dataLength) {
        colors.push(colorGroups[colorGroups.length - 1]?.color || '#3B82F6');
    }

    return colors;
}

// Alternative helper for simple two-color split
export function generateSplitColors(
    dataLength: number,
    firstColor: string = '#3B82F6',  // Blue
    secondColor: string = '#EF4444', // Red
    splitAt?: number
): string[] {
    const split = splitAt || Math.ceil(dataLength / 2);
    return Array.from({ length: dataLength }, (_, i) =>
        i < split ? firstColor : secondColor
    );
}

export default function BarChart({ data, options, title }: BenchmarkChartProps): JSX.Element {
    const defaultChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                display: false,
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
                title: {
                    display: true,
                    text: data.datasets[0]?.label || 'Value',
                    font: {
                        size: 14,
                    }
                }
            },
        },
        ...options,
    };

    return (
        <div style={{ height: '300px', position: 'relative' }}>
            <Bar data={data as ChartData<'bar', number[], string>} options={defaultChartOptions} />
        </div>
    );
}
