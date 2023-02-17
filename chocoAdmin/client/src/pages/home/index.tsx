import React, {FC} from "react";
import {useQuery} from "react-query";
import {getIncomesInfo, getStatsByCategory, getStatsByCity, getTopProducts} from "./index.utils";
import {StatsBy, StatsCompareIncomes, StatsTopProducts} from "../../services/types";
import {AxiosError} from "axios";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    FormControl,
    FormLabel,
    GridItem,
    Heading,
    Input,
    SimpleGrid,
    Spinner,
    VStack
} from "@chakra-ui/react";
import {PieChart} from "../../components/charts/pie-chart";
import {TopProducts} from "../../components/charts/top-products";
import {CompareIncomes} from "../../components/charts/compare-incomes";
import {IncomesChart} from "../../components/charts/incomes-chart";
import {Field, Form, Formik} from "formik";
import {getToken, login} from "../../services/jwt";
import {BiLogInCircle} from "react-icons/bi";

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
                    await login(values.username, values.password);
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
            <SimpleGrid columns={[1, 2, 3, 4]} gap={6}>
                <GridItem w='100%'>
                    <Card>
                        <CardHeader>
                            <Heading size={"md"}>Продажи по городам</Heading>
                        </CardHeader>
                        <CardBody>
                            {isStatsByCityLoading ? <Spinner/> : !isStatsByCityError ?
                                <PieChart data={statsByCity!}/> : null}
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem w='100%'>
                    <Card>
                        <CardHeader>
                            <Heading size={"md"}>Сравнение продаж за последние два месяца</Heading>
                        </CardHeader>
                        <CardBody>
                            {isCompareIncomesLoading ? <Spinner/> : !isCompareIncomesError ?
                                <CompareIncomes data={compareIncomes!}/> : null}
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem w='100%'>
                    <Card>
                        <CardHeader>
                            <Heading size={"md"}>10 самых продаваемых товаров</Heading>
                        </CardHeader>
                        <CardBody>
                            {isTopProductsLoading ? <Spinner/> : !isTopProductsError ?
                                <TopProducts data={topProductsData!}/> : null}
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem w='100%'>
                    <Card>
                        <CardHeader>
                            <Heading size={"md"}>Продажи за последние 10 месяцев</Heading>
                        </CardHeader>
                        <CardBody>
                            {isIncomesStatsLoading ? <Spinner/> : !isIncomesStatsError ?
                                <IncomesChart data={incomesStats!}/> : null}
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem w='100%'>
                    <Card>
                        <CardHeader>
                            <Heading size={"md"}>Продажи по категориям</Heading>
                        </CardHeader>
                        <CardBody>
                            {isStatsByCategoryLoading ? <Spinner/> : !isStatsByCategoryError ?
                                <PieChart data={statsByCategory!}/> : null}
                        </CardBody>
                    </Card>
                </GridItem>
            </SimpleGrid>}

    </div>
}

export default Home;