import React, {FC} from "react";
import {useQuery} from "react-query";
import {getIncomesInfo, getStatsByCity, getTopProducts} from "./index.utils";
import {StatsByCity, StatsCompareIncomes, StatsTopProducts} from "../../services/types";
import {AxiosError} from "axios";
import {GridItem, Heading, SimpleGrid, Spinner} from "@chakra-ui/react";
import {PieChart} from "../../components/charts/pie-chart";
import {TopProducts} from "../../components/charts/top-products";
import {CompareIncomes} from "../../components/charts/compare-incomes";
import {IncomesChart} from "../../components/charts/incomes-chart";

const Home: FC = () => {

    const {
        isLoading: isStatsByCityLoading,
        isError: isStatsByCityError,
        data: statsByCity
    } = useQuery<StatsByCity, AxiosError>("statsByCity", getStatsByCity);
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
    // const {data: statsCategories} = useQuery("statsByCity", getStatsByCity);
    // const {data: statsTotal2} = useQuery("statsByCity", getStatsByCity);
    // const {data: statsTotal10} = useQuery("statsByCity", getStatsByCity);

    return <div>
        <SimpleGrid columns={[1, 2, 3, 4]} gap={6}>
            <GridItem w='100%'>
                <Heading size={"md"} mb={4}>Продажи по городам</Heading>
                {isStatsByCityLoading ? <Spinner/> : !isStatsByCityError ? <PieChart data={statsByCity!}/> : null}

            </GridItem>
            <GridItem w='100%'>
                <Heading size={"md"} mb={4}>Сравнение продаж за последние два месяца</Heading>
                {isCompareIncomesLoading ? <Spinner/> : !isCompareIncomesError ?
                    <CompareIncomes data={compareIncomes!}/> : null}
            </GridItem>
            <GridItem w='100%'>
                <Heading size={"md"} mb={4}>10 самых продаваемых товаров</Heading>
                {isTopProductsLoading ? <Spinner/> : !isTopProductsError ?
                    <TopProducts data={topProductsData!}/> : null}
            </GridItem>
            <GridItem w='100%'>
                <Heading size={"md"} mb={4}>Продажи за последние 10 месяцев</Heading>
                {isIncomesStatsLoading ? <Spinner/> : !isIncomesStatsError ?
                    <IncomesChart data={incomesStats!}/> : null}
            </GridItem>
            <GridItem w='100%'></GridItem>
        </SimpleGrid>
    </div>
}

export default Home;