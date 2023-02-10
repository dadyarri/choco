import React, {FC} from 'react';
import {Pie} from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

type PieChartProps = {
    data: {
        name: string
        value: number
    }[]
}

export const PieChart: FC<PieChartProps> = (data) => {
    ChartJS.register(ArcElement, Tooltip, Legend);
    const hexToRgba = (hex: string, opacity: number) => {
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            let sourceColor = hex.substring(1).split('');
            if (sourceColor.length === 3) {
                sourceColor = [sourceColor[0], sourceColor[0], sourceColor[1], sourceColor[1], sourceColor[2], sourceColor[2]];
            }
            const hexColor = Number(`0x${sourceColor.join('')}`);
            const resultColor = [(hexColor >> 16) & 255, (hexColor >> 8) & 255, hexColor & 255].join(',')
            return `rgba(${resultColor}, ${opacity})`;
        }
        throw new Error('Bad Hex');
    }

    const colors = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
    ];


    const pieData = {
        labels: data.data?.map(item => item.name),
        datasets: [
            {
                label: "Заказов",
                data: data?.data.map(item => item.value),
                backgroundColor: colors.map(color => hexToRgba(color, 0.2)),
                borderColor: colors.map(color => hexToRgba(color, 1)),
                borderWidth: 1,
            }
        ]
    }

    return (
        <Pie data={pieData}/>
    )


}
