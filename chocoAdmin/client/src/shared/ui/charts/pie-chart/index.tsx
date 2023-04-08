import {Text, useColorMode} from "@chakra-ui/react";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";
import chroma from "chroma-js";
import React, {FC} from "react";
import {Pie} from "react-chartjs-2";

type PieChartProps = {
    data: {
        name: string
        value: number
    }[]
}

export const PieChart: FC<PieChartProps> = (data) => {
    ChartJS.register(ArcElement, Tooltip, Legend);
    const hexToRgba = (hex: string, opacity: number): string => {
        return chroma(hex).alpha(opacity).css();
    };

    const generateNonSimilarColors = (N: number): string[] => {
        const colors: string[] = [];

        const generateColor = (): string => {
            const hue = Math.floor(Math.random() * 360);
            const saturation = Math.floor(Math.random() * 60) + 20;
            const lightness = Math.floor(Math.random() * 40) + 30;

            const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            return chroma(hslColor).hex();
        };

        while (colors.length < N) {
            const color = generateColor();
            const isSimilar = colors.some((c) => chroma.deltaE(color, c) < 10);
            const contrastWhite = chroma.contrast(color, "white");
            const contrastBlack = chroma.contrast(color, "black");

            if (!isSimilar && contrastWhite >= 4.5 && contrastBlack >= 4.5) {
                colors.push(color);
            }
        }

        return colors;
    };

    const colors = generateNonSimilarColors(data.data.length);
    const {colorMode} = useColorMode();

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    color: colorMode === "light" ? "#000000" : "#ffffff",
                }
            },
        },

    };

    const pieData = {
        labels: data.data?.map(item => item.name),
        datasets: [
            {
                label: "Заказов",
                data: data?.data.map(item => item.value),
                backgroundColor: colors.map(color => hexToRgba(color, 0.5)),
                borderColor: colors.map(color => hexToRgba(color, 1)),
                borderWidth: 1,
            }
        ]
    };

    return (
        data.data.length > 0 ? <Pie options={options} data={pieData}/> : <Text>Недостаточно данных</Text>
    );


};
