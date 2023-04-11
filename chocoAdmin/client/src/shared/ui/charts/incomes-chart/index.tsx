import { useTheme } from "@mui/material";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import React, { FC } from "react";
import { Bar } from "react-chartjs-2";

import { StatsIncomesComparsion } from "entities/stats-incomes-comparsion";
import { StatsIncomesSummary } from "entities/stats-incomes-summary";

type IncomesChartProps = {
    data: StatsIncomesComparsion;
};

export const IncomesChart: FC<IncomesChartProps> = ({ data }) => {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const theme = useTheme();

    const isLightMode = theme.palette.mode === "light";
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    color:
                        isLightMode ? "rgba(0, 0, 0, 0.92)" : "rgba(255, 255, 255, 0.92)",
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    color:
                        isLightMode ? "rgba(0, 0, 0, 0.92)" : "rgba(255, 255, 255, 0.92)",
                    beginAtZero: true,
                },
                grid: {
                    color:
                        isLightMode ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)",
                },
            },
            x: {
                ticks: {
                    color:
                        isLightMode ? "rgba(0, 0, 0, 0.92)" : "rgba(255, 255, 255, 0.92)",
                    beginAtZero: true,
                },
                grid: {
                    color:
                        isLightMode ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)",
                },
            },
        },
    };
    data = data.sort((a, b) => b.index - a.index);

    const chartData = {
        labels: data?.map((item: StatsIncomesSummary) => item.dateInfo),
        datasets: [
            {
                label: "Сумма заказов",
                data: data?.map((item: StatsIncomesSummary) => item.total),
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };

    return <Bar options={options} data={chartData} style={{ maxHeight: "250px" }} />;
};
