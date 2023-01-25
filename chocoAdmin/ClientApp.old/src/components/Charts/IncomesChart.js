import {Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis} from "recharts";

export const IncomesChart = (data) => {
    return (
        <div className={"d-flex"} style={{width: "20rem"}}>
            <BarChart
                width={350}
                height={300}
                data={data.data.sort((a, b) => b.index - a.index)}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="dateInfo"/>
                <YAxis/>
                <Tooltip/>
                <Bar dataKey="total" fill="#82ca9d" name={"Сумма"}/>
            </BarChart>
        </div>
    )
}