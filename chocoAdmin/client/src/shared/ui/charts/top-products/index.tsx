import { ListItem, Text, UnorderedList } from "@chakra-ui/react";
import React, { FC } from "react";

type TopProduct = {
    name: string;
    value: number;
};
type TopProductsProps = {
    data: TopProduct[];
};

export const TopProducts: FC<TopProductsProps> = ({ data }) => {
    const inclineWord = (amount: number): string => {
        const lastDigit = amount % 10;
        if (amount % 100 >= 11 && amount % 100 <= 14) {
            return "заказов";
        } else if (amount === 1) {
            return "заказе";
        } else if (lastDigit === 1) {
            return "заказ";
        } else if ((lastDigit >= 2 && lastDigit <= 4) || (amount >= 2 && amount <= 4)) {
            return "заказах";
        } else {
            return "заказов";
        }
    };

    return data.length > 0 ? (
        <UnorderedList>
            {data.map((item) => (
                <ListItem key={item.name}>
                    {item.name} (в {item.value} {inclineWord(item.value)})
                </ListItem>
            ))}
        </UnorderedList>
    ) : (
        <Text>Недостаточно данных</Text>
    );
};
