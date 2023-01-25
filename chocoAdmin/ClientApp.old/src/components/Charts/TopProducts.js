import {List} from "reactstrap";

export const TopProducts = ({ data }) => {
  return <List>
      {data.map((item) => <li key={item.name}>{item.name} (в {item.value} заказах)</li>)}
  </List>
}