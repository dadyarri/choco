import H from "@here/maps-api-for-javascript";
import {toast} from "react-toastify";


import {GeocodingResult} from "entities/geocoding-result";
import {Order} from "entities/order";
import HttpService from "services/http";


export const fetchOrdersList = async (): Promise<Order[]> => {
    return await HttpService.getOrders()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения списка заказов!
            ${error?.response.data}`);
            throw error;
        });
};

export const fetchProductsList = async () => {
    return await HttpService.getProducts()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения списка товаров!
            ${error?.response.data}`);
            throw error;
        });
};

export const deleteOrder = async (orderId: string) => {
    return await HttpService.deleteOrder(orderId)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка удаления заказа!
            ${error?.response.data}`);
            throw error;
        });
};

export const restoreFromDeleted = async (orderId: string) => {
    return await HttpService.restoreOrderFromDeleted(orderId)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка восстановления заказа
            ${error?.response.data}`);
            throw error;
        });
};

export const requestRouteLink = async (address: string, latitude: number, longitude: number) => {
    const platform = new H.service.Platform({
        apikey: "TAYbIDK8GFikPYepbHQmunHMTJ-Bqcxy__auQNrYtQ0"
    });
    const service = platform.getSearchService();
    service.geocode({q: address},
        (result) => {
            const {lat, lng} = (result as GeocodingResult).items[0].position;

            window.open(`https://yandex.ru/maps/?mode=routes&rtext=${latitude},${longitude}~${lat},${lng}`, "_blank");
        },
        (error) => {
            throw error;
        }
    );
};