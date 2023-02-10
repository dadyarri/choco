import React, {FC} from "react";
import {useQuery} from "react-query";
import {getStatsByCity} from "./index.utils";
import {StatsByCity, StatsCompareIncomes} from "../../services/types";
import {AxiosError} from "axios";
import {Grid, GridItem, Heading, Spinner} from "@chakra-ui/react";
import {PieChart} from "../../components/charts/pie-chart/pie-chart";

const Home: FC = () => {

    const {isLoading: isStatsByCityLoading, isError: isStatsByCityError, data: statsByCity} = useQuery<StatsByCity, AxiosError>("statsByCity", getStatsByCity);
    const {data: compareIncomes} = useQuery<StatsCompareIncomes, AxiosError>("compareIncomes", getStatsByCity);
    // const {data: statsTopProducts} = useQuery("statsByCity", getStatsByCity);
    // const {data: statsCategories} = useQuery("statsByCity", getStatsByCity);
    // const {data: statsTotal2} = useQuery("statsByCity", getStatsByCity);
    // const {data: statsTotal10} = useQuery("statsByCity", getStatsByCity);

    return <div>
        <Grid templateColumns='repeat(5, 1fr)' gap={6}>
            <GridItem w='100%' >
                <Heading size={"md"} mb={4}>Продажи по городам</Heading>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/*@ts-ignore*/}
                {isStatsByCityLoading ? <Spinner/> : !isStatsByCityError ? <PieChart data={statsByCity}/> : null}

            </GridItem>
            <GridItem w='100%' >
                {/*<CompareIncomes data={compareIncomes!}/>*/}
            </GridItem>
            <GridItem w='100%' ></GridItem>
            <GridItem w='100%' ></GridItem>
            <GridItem w='100%' ></GridItem>
        </Grid>
    </div>
}

export default Home;