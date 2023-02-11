import React, {FC} from "react";
import {useQuery} from "react-query";
import {getIncomesInfo, getStatsByCategory, getStatsByCity, getTopProducts} from "./index.utils";
import {StatsBy, StatsCompareIncomes, StatsTopProducts} from "../../services/types";
import {AxiosError} from "axios";
import {Card, CardBody, CardHeader, GridItem, Heading, SimpleGrid, Spinner} from "@chakra-ui/react";
import {PieChart} from "../../components/charts/pie-chart";
import {TopProducts} from "../../components/charts/top-products";
import {CompareIncomes} from "../../components/charts/compare-incomes";
import {IncomesChart} from "../../components/charts/incomes-chart";

const Home: FC = () => {

    const {
        isLoading: isStatsByCityLoading,
        isError: isStatsByCityError,
        data: statsByCity
    } = useQuery<StatsBy, AxiosError>("statsByCity", getStatsByCity);
    const {
        isLoading: isCompareIncomesLoading,
        isError: isCompareIncomesError,
        data: compareIncomes
    } = useQuery<StatsCompareIncomes, AxiosError>(["compareIncomes", 2], () => getIncomesInfo(2));
    const {
        isLoading: isTopProductsLoading,
        isError: isTopProductsError,
        data: topProductsData
    } = useQuery<StatsTopProducts, AxiosError>("topProducts", getTopProducts);
    const {
        isLoading: isIncomesStatsLoading,
        isError: isIncomesStatsError,
        data: incomesStats
    } = useQuery<StatsCompareIncomes, AxiosError>(["compareIncomes", 10], () => getIncomesInfo(10));
    const {
        isLoading: isStatsByCategoryLoading,
        isError: isStatsByCategoryError,
        data: statsByCategory
    } = useQuery<StatsBy, AxiosError>("statsByCategory", getStatsByCategory);

    return <div>
        <SimpleGrid columns={[1, 2, 3, 4]} gap={6}>
            <GridItem w='100%'>
                <Card>
                    <CardHeader>
                        <Heading size={"md"} mb={4}>Продажи по городам</Heading>
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
                        <Heading size={"md"} mb={4}>Сравнение продаж за последние два месяца</Heading>
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
                        <Heading size={"md"} mb={4}>10 самых продаваемых товаров</Heading>
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
                        <Heading size={"md"} mb={4}>Продажи за последние 10 месяцев</Heading>
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
                        <Heading size={"md"} mb={4}>Продажи по категориям</Heading>
                    </CardHeader>
                    <CardBody>
                        {isStatsByCategoryLoading ? <Spinner/> : !isStatsByCategoryError ?
                            <PieChart data={statsByCategory!}/> : null}
                    </CardBody>
                </Card>
            </GridItem>
        </SimpleGrid>
    </div>
}

export default Home;