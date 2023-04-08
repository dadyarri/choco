import {Card, CardBody, CardHeader, Heading} from "@chakra-ui/react";
import React, {FC, ReactNode} from "react";

type ChartContainerProps = {
    header: string,
    children?: ReactNode
}

export const ChartContainer: FC<ChartContainerProps> = ({header, children}) => {
    return <Card w="100%"
                 mb={3}
                 sx={{display: "inline-block"}}
    >
        <CardHeader>
            <Heading size={"md"}>{header}</Heading>
        </CardHeader>
        <CardBody>
            {children}
        </CardBody>
    </Card>;
};