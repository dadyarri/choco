import HttpService from "../../services/http";
import {toast} from "react-toastify";
import {InventoryRequestBody} from "../../services/request-bodies";

export const fetchProductsList = async () => {
    return await HttpService.getProducts()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения списка товаров!
            ${error?.response.data}`);
            throw error;
        })
}

export const sendInventory = async (data: InventoryRequestBody) => {
    return await HttpService.sendInventory(data)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка отправки ревизии
            ${error?.response.data}`);
            throw error
        })
}