import React, {FC} from "react";
import {useQuery} from "react-query";
import {getStatsByCity, getTopProducts} from "./index.utils";
import {StatsByCity, StatsCompareIncomes, StatsTopProducts} from "../../services/types";
import {AxiosError} from "axios";
import {GridItem, Heading, SimpleGrid, Spinner} from "@chakra-ui/react";
import {PieChart} from "../../components/charts/pie-chart";
import {TopProducts} from "../../components/charts/top-products";

const Home: FC = () => {

    const {isLoading: isStatsByCityLoading, isError: isStatsByCityError, data: statsByCity} = useQuery<StatsByCity, AxiosError>("statsByCity", getStatsByCity);
    const {data: compareIncomes} = useQuery<StatsCompareIncomes, AxiosError>("compareIncomes", getStatsByCity);
    const {isLoading: isTopProductsLoading, isError: isTopProductsError, data: topProductsData} = useQuery<StatsTopProducts, AxiosError>("topProducts", getTopProducts);
    // const {data: statsTopProducts} = useQuery("statsByCity", getStatsByCity);
    // const {data: statsCategories} = useQuery("statsByCity", getStatsByCity);
    // const {data: statsTotal2} = useQuery("statsByCity", getStatsByCity);
    // const {data: statsTotal10} = useQuery("statsByCity", getStatsByCity);

    return <div>
        <SimpleGrid columns={[1, 2, 3, 4]} gap={6}>
            <GridItem w='100%' >
                <Heading size={"md"} mb={4}>Продажи по городам</Heading>
                {isStatsByCityLoading ? <Spinner/> : !isStatsByCityError ? <PieChart data={statsByCity!}/> : null}

            </GridItem>
            <GridItem w='100%' >
                {/*<CompareIncomes data={compareIncomes!}/>*/}
            </GridItem>
            <GridItem w='100%' >
                <Heading size={"md"} mb={4}>10 самых продаваемых товаров</Heading>
                {isTopProductsLoading ? <Spinner/> : !isTopProductsError ? <TopProducts data={topProductsData!}/>: null}
            </GridItem>
            <GridItem w='100%' ></GridItem>
            <GridItem w='100%' ></GridItem>
        </SimpleGrid>
    </div>
}

export default Home;