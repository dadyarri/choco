import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import {Bar} from "react-chartjs-2";
import {IncomeInfo} from "../../../services/types";
import {FC} from "react";
import {useColorMode} from "@chakra-ui/react";

type IncomesChartProps = {
    data: IncomeInfo[]
}

export const IncomesChart: FC<IncomesChartProps> = ({data}) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const {colorMode} = useColorMode();

    const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom' as const,
                    labels: {
                        color: colorMode === "light" ? "rgba(0, 0, 0, 0.92)" : "rgba(255, 255, 255, 0.92)",
                    }
                },
            },
            scales: {
                y: {
                    ticks: {
                        color: colorMode === "light" ? "rgba(0, 0, 0, 0.92)" : "rgba(255, 255, 255, 0.92)",
                        beginAtZero: true
                    },
                    grid: {
                        color: colorMode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)"
                    }
                },
                x: {
                    ticks: {
                        color: colorMode === "light" ? "rgba(0, 0, 0, 0.92)" : "rgba(255, 255, 255, 0.92)",
                        beginAtZero: true
                    },
                    grid: {
                        color: colorMode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)"
                    }
                }
            }
        }
    ;

    data = data.sort((a, b) => b.index - a.index)

    const chartData = {
        labels: data?.map((item: IncomeInfo) => item.dateInfo),
        datasets: [
            {
                label: 'Сумма заказов',
                data: data?.map((item: IncomeInfo) => item.total),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };

    return (
        <Bar options={options} data={chartData} style={{height: "250px"}}/>
    )
}