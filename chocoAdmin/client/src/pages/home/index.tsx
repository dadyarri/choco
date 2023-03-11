import React, {FC} from "react";
import {useQuery} from "react-query";
import {getIncomesInfo, getStatsByCategory, getStatsByCity, getTopProducts} from "./index.utils";
import {StatsBy, StatsCompareIncomes, StatsTopProducts} from "../../services/types";
import {AxiosError} from "axios";
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
import {PieChart} from "../../components/charts/pie-chart";
import {TopProducts} from "../../components/charts/top-products";
import {CompareIncomes} from "../../components/charts/compare-incomes";
import {IncomesChart} from "../../components/charts/incomes-chart";
import {Field, Form, Formik} from "formik";
import {getToken, loginByPassword} from "../../services/jwt";
import {BiLogInCircle} from "react-icons/bi";
import {ChartContainer} from "../../components/charts/chart-container";

const Home: FC = () => {

    const hasAuthData = !!getToken();

    const {
        isLoading: isStatsByCityLoading,
        isError: isStatsByCityError,
        data: statsByCity
    } = useQuery<StatsBy, AxiosError>(
        "statsByCity",
        getStatsByCity,
        {enabled: hasAuthData}
    );
    const {
        isLoading: isCompareIncomesLoading,
        isError: isCompareIncomesError,
        data: compareIncomes
    } = useQuery<StatsCompareIncomes, AxiosError>(
        ["compareIncomes", 2],
        () => getIncomesInfo(2),
        {enabled: hasAuthData}
    );

    const {
        isLoading: isTopProductsLoading,
        isError: isTopProductsError,
        data: topProductsData
    } = useQuery<StatsTopProducts, AxiosError>(
        "topProducts",
        getTopProducts,
        {enabled: hasAuthData}
    );

    const {
        isLoading: isIncomesStatsLoading,
        isError: isIncomesStatsError,
        data: incomesStats
    } = useQuery<StatsCompareIncomes, AxiosError>(
        ["compareIncomes", 10],
        () => getIncomesInfo(10),
        {enabled: hasAuthData}
    );

    const {
        isLoading: isStatsByCategoryLoading,
        isError: isStatsByCategoryError,
        data: statsByCategory
    } = useQuery<StatsBy, AxiosError>(
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
                 sx={{columnCount: [1, 2, 3], columnGap: "20px", rowGap: "20px"}}>
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
    </div>
}

export default Home;