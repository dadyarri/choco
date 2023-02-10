import {List} from "@chakra-ui/react";
import {FC} from "react";

type TopProductsProps = {
  data: {
    name: string,
    value: number
  }[]
}

export const TopProducts: FC<TopProductsProps> = ({ data }) => {
  return <List>
      {data.map((item) => <li key={item.name}>{item.name} (в {item.value} заказах)</li>)}
  </List>
}