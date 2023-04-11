import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import { Box, Chip, Typography } from "@mui/material";
import React, { FC } from "react";

import { StatsIncomesComparsion } from "entities/stats-incomes-comparsion";

type CompareIncomesProps = {
    data: StatsIncomesComparsion;
};

export const CompareIncomes: FC<CompareIncomesProps> = ({ data }) => {
    const isSurplus = data[0].total >= data[1].total;
    return (
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Typography variant={"h6"}>{data[0].total}&#8381;</Typography>
            <Chip
                icon={isSurplus ? <CallMadeIcon /> : <CallReceivedIcon />}
                color={isSurplus ? "success" : "error"}
                label={
                    <Typography variant={"h6"} sx={{ marginLeft: 2 }}>
                        {Math.abs(data[0].total - data[1].total)}
                    </Typography>
                }
            />
        </Box>
    );
};
