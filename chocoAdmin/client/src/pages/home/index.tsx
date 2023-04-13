import { Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

import {
    statsSalesbyCityLib,
    statsSalesByCategoryLib,
    statsIncomesComparsionLib,
    statsSalesByProductLib,
} from "entities";
import { auth } from "features";
import { CompareIncomes } from "shared/ui/charts/compare-incomes";
import { IncomesChart } from "shared/ui/charts/incomes-chart";
import { PieChart } from "shared/ui/charts/pie-chart";
import { TopProducts } from "shared/ui/charts/top-products";

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.hasToken() || !auth.tokenIsValid()) {
            navigate("/app/login");
        }
    }, [navigate]);

    const statsByCity = useQuery("statsByCity", statsSalesbyCityLib.getSalesByCity);
    const statsByCategory = useQuery("statsByCategory", statsSalesByCategoryLib.getSalesByCategory);
    const statsByProducts = useQuery("statsByProducts", statsSalesByProductLib.getSalesByProducts);
    const statsFor2Months = useQuery(["statsForMonths", 2], () =>
        statsIncomesComparsionLib.getIncomesComparsion(2),
    );
    const statsFor10Months = useQuery(["statsForMonths", 10], () =>
        statsIncomesComparsionLib.getIncomesComparsion(10),
    );

    return (
        <>
            <Typography variant={"h4"}>Главная</Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <Card sx={{ maxWidth: { sm: "100%", md: 300 }, maxHeight: 400 }}>
                        <CardContent>
                            <Typography variant={"h6"} sx={{ marginBottom: 3 }}>
                                Продажи по городам
                            </Typography>
                            {statsByCity.isLoading && <CircularProgress />}
                            {statsByCity.data !== undefined && <PieChart data={statsByCity.data} />}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card sx={{ maxWidth: { sm: "100%", md: 300 }, maxHeight: 400 }}>
                        <CardContent>
                            <Typography variant={"h6"} sx={{ marginBottom: 3 }}>
                                Продажи по категориям
                            </Typography>
                            {statsByCategory.isLoading && <CircularProgress />}
                            {statsByCategory.data !== undefined && (
                                <PieChart data={statsByCategory.data} />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card sx={{ maxWidth: { sm: "100%", md: 300 }, maxHeight: 400 }}>
                        <CardContent>
                            <Typography variant={"h6"} sx={{ marginBottom: 3 }}>
                                Сравнение за последние два месяца
                            </Typography>
                            {statsFor2Months.isLoading && <CircularProgress />}
                            {statsFor2Months.data !== undefined && (
                                <CompareIncomes data={statsFor2Months.data} />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card sx={{ maxWidth: { sm: "100%", md: 300 }, maxHeight: 400 }}>
                        <CardContent>
                            <Typography variant={"h6"} sx={{ marginBottom: 3 }}>
                                Продажи за последние 10 месяцев
                            </Typography>
                            {statsFor10Months.isLoading && <CircularProgress />}
                            {statsFor10Months.data !== undefined && (
                                <IncomesChart data={statsFor10Months.data} />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Card sx={{ maxWidth: { sm: "100%", md: 300 }, maxHeight: 400 }}>
                        <CardContent>
                            <Typography variant={"h6"} sx={{ marginBottom: 3 }}>
                                Самые продаваемые товары
                            </Typography>
                            {statsByProducts.isLoading && <CircularProgress />}
                            {statsByProducts.data !== undefined && <TopProducts data={statsByProducts.data} />}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default HomePage;
