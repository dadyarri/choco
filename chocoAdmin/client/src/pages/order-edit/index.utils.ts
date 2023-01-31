import {Order, OrderCity, OrderStatus} from "../../services/types";
import HttpService from "../../services/http";
import {toast} from "react-toastify";
import {UpdateOrderRequestBody} from "../../services/request-bodies";

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

export const fetchOrderCitiesList = async (): Promise<OrderCity[]> => {
    return await HttpService.getOrderCities()
        .then((response) => response.data)
        .catch((error) => {
            toast('Ошибка получения данных!');
            return error;
        })
}


export const updateOrder = async (orderId: string, values: UpdateOrderRequestBody): Promise<Order> => {
    return await HttpService.updateOrder(orderId, values)
        .then((response) => response.data)
        .catch((error) => {
            toast("Ошибка обновления заказа!");
            return error;
        })
}

export const createOrder = async (values: UpdateOrderRequestBody): Promise<Order> => {
    return await HttpService.createOrder(values)
        .then((response) => response.data)
        .catch((error) => {
            toast("Ошибка создания заказа!");
            return error;
        })
}