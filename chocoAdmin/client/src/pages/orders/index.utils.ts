import {Order} from "../../services/types";
import HttpService from "../../services/http";
import {toast} from "react-toastify";

export const fetchOrdersList = async (): Promise<Order[]> => {
    return await HttpService.getOrders()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения данных!
            ${error?.response.data}`);
            return error;
        })
}

export const fetchProductsList = async () => {
    return await HttpService.getProducts()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения данных!
            ${error?.response.data}`);
            return error;
        })
}

export const deleteOrder = async (orderId: string) => {
    return await HttpService.deleteOrder(orderId)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка удаления заказа!
            ${error?.response.data}`);
            return error;
        })
}

export const restoreFromDeleted = async (orderId: string) => {
    return await HttpService.restoreOrderFromDeleted(orderId)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка восстановления заказа
            ${error?.response.data}`);
            return error;
        })
}

export const requestRouteLink = async (address: string, latitude: number, longitude: number): Promise<string> => {
    return await HttpService.getRouteLink(address, latitude, longitude)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения маршрута
            ${error?.response.data}`);
            throw error
        })
}