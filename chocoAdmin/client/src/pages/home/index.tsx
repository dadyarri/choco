import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Spinner,
    VStack
} from "@chakra-ui/react";
import {AxiosError} from "axios";
import {Field, Form, Formik} from "formik";
import React, {FC} from "react";
import {BiLogInCircle} from "react-icons/bi";
import {useQuery} from "react-query";

import {getToken, loginByPassword} from "services/jwt";

import { StatsIncomesComparsion } from "entities/stats-incomes-comparsion";
import {StatsSalesByCategory} from "entities/stats-sales-by-category";
import {StatsSalesByCity} from "entities/stats-sales-by-city";
import {StatsSalesByProduct} from "entities/stats-sales-by-products";

import {ChartContainer} from "shared/ui/charts/chart-container";
import {CompareIncomes} from "shared/ui/charts/compare-incomes";
import {IncomesChart} from "shared/ui/charts/incomes-chart";
import {PieChart} from "shared/ui/charts/pie-chart";
import {TopProducts} from "shared/ui/charts/top-products";

import {getIncomesInfo, getStatsByCategory, getStatsByCity, getTopProducts} from "./index.utils";

const Home: FC = () => {

    const hasAuthData = !!getToken();

    const {
        isLoading: isStatsByCityLoading,
        isError: isStatsByCityError,
        data: statsByCity
    } = useQuery<StatsSalesByCity, AxiosError>(
        "statsByCity",
        getStatsByCity,
        {enabled: hasAuthData}
    );
    const {
        isLoading: isCompareIncomesLoading,
        isError: isCompareIncomesError,
        data: compareIncomes
    } = useQuery<StatsIncomesComparsion, AxiosError>(
        ["compareIncomes", 2],
        () => getIncomesInfo(2),
        {enabled: hasAuthData}
    );

    const {
        isLoading: isTopProductsLoading,
        isError: isTopProductsError,
        data: topProductsData
    } = useQuery<StatsSalesByProduct, AxiosError>(
        "topProducts",
        getTopProducts,
        {enabled: hasAuthData}
    );

    const {
        isLoading: isIncomesStatsLoading,
        isError: isIncomesStatsError,
        data: incomesStats
    } = useQuery<StatsIncomesComparsion, AxiosError>(
        ["compareIncomes", 10],
        () => getIncomesInfo(10),
        {enabled: hasAuthData}
    );

    const {
        isLoading: isStatsByCategoryLoading,
        isError: isStatsByCategoryError,
        data: statsByCategory
    } = useQuery<StatsSalesByCategory, AxiosError>(
        "statsByCategory",
        getStatsByCategory,
        {enabled: hasAuthData}
    );

    return <div>
        {!hasAuthData ? <div>
                <Formik initialValues={{username: "", password: ""}} onSubmit={async (values) => {
                    const isLoggedIn = await loginByPassword(values.username, values.password);

                    if (isLoggedIn) {
                        window.location.reload();
                    }

                }}>
                    {() => (
                        <Center>
                            <Card width={"80%"}>
                                <CardHeader>
                                    <Heading size={"md"}>Войти в аккаунт</Heading>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <VStack spacing={4} align={"flex-start"}>
                                            <FormControl>
                                                <FormLabel>Имя пользователя</FormLabel>
                                                <Field
                                                    as={Input}
                                                    type={"text"}
                                                    name={"username"}
                                                    autoComplete={"username"}/>
                                            </FormControl>
                                            <FormControl>
                                                <FormLabel>Пароль</FormLabel>
                                                <Field
                                                    as={Input}
                                                    type={"password"}
                                                    name={"password"}
                                                    autoComplete={"current-password"}/>
                                            </FormControl>
                                            <Button
                                                colorScheme={"green"}
                                                leftIcon={<BiLogInCircle/>}
                                                type={"submit"}>
                                                Войти
                                            </Button>
                                        </VStack>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Center>
                    )}
                </Formik>
            </div> :
            <Box padding={4}
                 w="100%"
                 maxW="1500px"
                 mx="auto"
                 sx={{columnCount: [1, 2, 3, 4], columnGap: "20px", rowGap: "20px"}}>
                <ChartContainer header={"Продажи по городам"}>
                    {isStatsByCityLoading ? <Spinner/> : !isStatsByCityError ?
                        <PieChart data={statsByCity!}/> : null}
                </ChartContainer>
                <ChartContainer header={"Сравнение продаж за последние два месяца"}>
                    {isCompareIncomesLoading ? <Spinner/> : !isCompareIncomesError ?
                        <CompareIncomes data={compareIncomes!}/> : null}
                </ChartContainer>
                <ChartContainer header={"10 самых продаваемых товаров"}>
                    {isTopProductsLoading ? <Spinner/> : !isTopProductsError ?
                        <TopProducts data={topProductsData!}/> : null}
                </ChartContainer>
                <ChartContainer header={"Продажи за последние 10 месяцев"}>
                    {isIncomesStatsLoading ? <Spinner/> : !isIncomesStatsError ?
                        <IncomesChart data={incomesStats!}/> : null}
                </ChartContainer>
                <ChartContainer header={"Продажи по категориям"}>
                    {isStatsByCategoryLoading ? <Spinner/> : !isStatsByCategoryError ?
                        <PieChart data={statsByCategory!}/> : null}
                </ChartContainer>
            </Box>

        }
    </div>;
};

export default Home;