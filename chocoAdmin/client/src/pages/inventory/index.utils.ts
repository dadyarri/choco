import {Error} from "entities";
import {toast} from "react-toastify";

import HttpService from "services/http";
import {InventoryRequestBody} from "services/request-bodies";

import {products} from "shared/api";
import {errorHappened, sendToast} from "shared/lib";

export const fetchProductsList = async () => {
    return await products.getAll()
        .then((data) => {
            if (errorHappened(data)) {
                data = data as Error;
                sendToast(data, "Ошибка получения списка товаров!");
            }
            return data;
        });
};

export const sendInventory = async (data: InventoryRequestBody) => {
    return await HttpService.sendInventory(data)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка отправки ревизии
            ${error?.response.data}`);
            throw error;
        });
};