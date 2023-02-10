import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Bar} from "react-chartjs-2";
import {IncomeInfo} from "../../../services/types";
import {FC} from "react";

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

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

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
        <Bar options={options} data={chartData}/>
    )
}