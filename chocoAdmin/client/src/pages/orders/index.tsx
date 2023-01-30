import {useQuery} from "react-query";
import {AxiosError} from "axios";
import {Order} from "../../services/types";
import {fetchOrdersList} from "./index.utils";

const Orders = () => {

  const { isLoading, isError, data, error} = useQuery<Order[], AxiosError>("orders", fetchOrdersList);

  return <>
  </>
}

export default Orders;