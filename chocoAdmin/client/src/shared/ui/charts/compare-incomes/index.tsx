import {Badge, Center, Flex, Heading, Spacer, Text} from "@chakra-ui/react";
import {StatsIncomesComparsion} from "entities";
import React, {FC} from "react";
import {BsArrowDownRight, BsArrowUpRight} from "react-icons/bs";

type CompareIncomesProps = {
    data: StatsIncomesComparsion
}

export const CompareIncomes: FC<CompareIncomesProps> = ({data}) => {

    const isSurplus = data[0].total >= data[1].total;
    return (
        <Flex>
            <Center>
                <Heading size={"sm"}>{data[0].total} &#8381;</Heading>
            </Center>
            <Spacer/>
            <Center>
                <Badge colorScheme={isSurplus ? "green" : "red"} fontSize={"2em"}>
                    <Heading size={"sm"} p={2}>
                        <Flex>
                            {isSurplus ? <BsArrowUpRight/> : <BsArrowDownRight/>}
                            <Text ml={1}>{Math.abs(data[0].total - data[1].total)}</Text>
                        </Flex>
                    </Heading>
                </Badge>
            </Center>
        </Flex>
    );
};