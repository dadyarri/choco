import { Avatar, Box, Grid, Typography } from "@mui/material";
import React from "react";

export default () => {
    return (
        <>
            <Typography variant={"h2"}>Профиль</Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Grid container sx={{ marginY: "10px" }}>
                    <Grid item xs={8}>
                        Привет, Даниил
                    </Grid>
                    <Grid item>
                        <Avatar
                            alt={"avatar"}
                            src={"https://www.dadyarri.ru/images/index/webp/avatar.webp"}
                        ></Avatar>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
