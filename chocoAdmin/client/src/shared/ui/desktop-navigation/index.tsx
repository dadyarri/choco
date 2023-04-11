import { AppBar, Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default () => {
    return (
        <AppBar position={"sticky"}>
            <Container maxWidth={"xl"} sx={{ padding: 1, display: "flex" }}>
                <Typography
                    variant="h5"
                    noWrap
                    sx={{
                        mr: 2,
                        display: { xs: "none", md: "flex" },
                        fontWeight: 700,
                        color: "inherit",
                        textDecoration: "none",
                    }}
                    component={Link}
                    to={"/app"}
                >
                    Шокоадминка
                </Typography>
                <Box sx={{ flexGrow: 1, display: "flex"}}>
                    <Button
                        sx={{ color: "white", display: "block" }}
                        component={Link}
                        to={"/app/orders"}
                    >
                        Заказы
                    </Button>
                    <Button
                        sx={{ color: "white", display: "block" }}
                        component={Link}
                        to={"/app/shipments"}
                    >
                        Поставки
                    </Button>
                    <Button
                        sx={{ color: "white", display: "block" }}
                        component={Link}
                        to={"/app/warehouse"}
                    >
                        Склад
                    </Button>
                    <Button
                        sx={{ color: "white", display: "block" }}
                        component={Link}
                        to={"/app/profile"}
                    >
                        Профиль
                    </Button>
                </Box>
            </Container>
        </AppBar>
    );
};