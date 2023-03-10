import HttpService from "../../services/http";
import {toast} from "react-toastify";

export const fetchProductsList = async () => {
    return await HttpService.getProducts()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения списка товаров!
            ${error?.response.data}`);
            throw error;
        })
}

export const deleteProduct = async (id: string) => {
    return await HttpService.deleteProduct(id)
        .then(response => response.data)
        .catch((error) => {
            toast(`Ошибка удаления товара!
            ${error?.response.data}`);
            throw error;
        })
}

export const restoreProduct = async (id: string) => {
    return await HttpService.restoreProduct(id)
        .then(response => response.data)
        .catch((error) => {
            toast(`Ошибка восстановления товара!
            ${error?.response.data}`);
            throw error;
        })
}
export const openVkPageOfProduct = async (marketId: number) => {
    return await HttpService.getMarketUrl(marketId)
        .then((response) => {
            const url = response.data.url;
            window.open(url, "_blank");
        })
        .catch((error) => {
            toast(`Ошибка получения ссылки на товар!
            ${error?.response.data}`);
            throw error;
        })
}