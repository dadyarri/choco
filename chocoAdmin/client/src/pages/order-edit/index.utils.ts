import {Order, OrderStatus} from "../../services/types";
import HttpService from "../../services/http";
import {toast} from "react-toastify";

export const getOrderById = async (orderId: string): Promise<Order> => {
    return await HttpService.getOrderById(orderId)
        .then((response) => response.data)
        .catch((error) => {
            toast("Ошибка получения данных!");
            return error
        })

}

export const fetchOrderStatusesList = async (): Promise<OrderStatus[]> => {
    return await HttpService.getOrderStatuses()
        .then((response) => response.data)
        .catch((error) => {
            toast('Ошибка получения данных!');
            return error;
        })
}