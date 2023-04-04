import {Customer, Order, OrderCity, OrderStatus} from "../../services/types";
import HttpService from "../../services/http";
import {toast} from "react-toastify";
import {UpdateOrderRequestBody} from "../../services/request-bodies";

export const getCustomerById = async (orderId: string): Promise<Customer> => {
    return await HttpService.getCustomerById(orderId)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения данных о покупателе!
            ${error?.response.data}`);
            throw error
        })

}

export const fetchOrderStatusesList = async (): Promise<OrderStatus[]> => {
    return await HttpService.getOrderStatuses()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения списка статусов заказа!
            ${error?.response.data}`);
            throw error;
        })
}

export const fetchOrderCitiesList = async (): Promise<OrderCity[]> => {
    return await HttpService.getOrderCities()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения списка городов!
            ${error?.response.data}`);
            throw error;
        })
}


export const updateCustomer = async (orderId: string, values: UpdateCustomerRequestBody): Promise<Customer> => {
    return await HttpService.updateCustomer(orderId, values)
        .then((response) => {
            toast("Клиент обновлён!")
            return response.data
        })
        .catch((error) => {
            toast(`Ошибка обновления клиента!
${error?.response.data}`);
            throw error;
        })
}

export const createCustomer = async (values: UpdateCustomerRequestBody): Promise<Customer> => {
    return await HttpService.createCustomer(values)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка создания клиента!
            ${error?.response.data}`);
            throw error;
        })
}