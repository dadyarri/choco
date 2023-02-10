import {List} from "@chakra-ui/react";
import {FC} from "react";

type TopProduct = {
  name: string,
  value: number
};
type TopProductsProps = {
  data: TopProduct[]
}

export const TopProducts: FC<TopProductsProps> = ({ data }) => {
  return <List>
      {data.map((item) => <li key={item.name}>{item.name} (в {item.value} заказах)</li>)}
  </List>
}