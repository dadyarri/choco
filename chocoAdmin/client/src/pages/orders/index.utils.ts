import {Order} from "../../services/types";
import HttpService from "../../services/http";
import {toast} from "react-toastify";

export const fetchOrdersList = async (): Promise<Order[]> => {
    return await HttpService.getOrders()
        .then((response) => response.data)
        .catch((error) => {
            toast('Ошибка получения данных!');
            return error;
        })
}