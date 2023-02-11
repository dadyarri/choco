import {ListItem, UnorderedList} from "@chakra-ui/react";
import {FC} from "react";

type TopProduct = {
  name: string,
  value: number
};
type TopProductsProps = {
  data: TopProduct[]
}

export const TopProducts: FC<TopProductsProps> = ({ data }) => {
  return <UnorderedList>
      {data.map((item) => <ListItem key={item.name}>{item.name} (в {item.value} заказах)</ListItem>)}
  </UnorderedList>
}