import React, {FC} from 'react';
import {Pie} from "react-chartjs-2";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';

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


    const getRandomColor = () => {

        const h = Math.floor(Math.random() * 360);
        const s = 100;
        let l = 30;

        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;

    }

    const colors = Array.from({length: data.data.length}, getRandomColor);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

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
        <Pie options={options} data={pieData}/>
    )


}
