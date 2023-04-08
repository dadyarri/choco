import {toast} from "react-toastify";

import HttpService from "services/http";


export const getStatsByCity = async () => {
    return await HttpService.getStatsByCity().then(
        (response) => response.data
    ).catch((error) => {
        toast(`Ошибка получения данных статистики по городам
        ${error.data?.message}`);
    });
};

export const getTopProducts = async () => {
    return await HttpService.getTopProducts()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения самых продаваемых товаров
        ${error.data?.message}`);
            throw error;
        });
};

export const getIncomesInfo = async (months: number) => {
    return await HttpService.getIncomesInfo(months)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения суммы продаж за ${months} месяц(ев)
        ${error.data?.message}`);
            throw error;
        });
};

export const getStatsByCategory = async () => {
    return await HttpService.getStatsByCategory().then(
        (response) => response.data
    ).catch((error) => {
        toast(`Ошибка получения статистики продаж по категориям
        ${error.data?.message}`);
        throw error;
    });
};