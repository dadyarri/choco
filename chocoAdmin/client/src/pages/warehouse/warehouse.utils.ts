import HttpService from "../../services/http";
import {toast} from "react-toastify";

export const fetchProductsList = async () => {
    return await HttpService.getProducts()
        .then((response) => response.data)
        .catch((error) => {
            toast('Ошибка получения данных!');
            return error;
        })
}

export const openEditModal = (id: string) => {
}
export const deleteProduct = async (id: string) => {
    return await HttpService.deleteProduct(id)
        .then(response => response.data)
        .catch((error) => {
            toast("Ошибка удаления товара!");
            return error;
        })
}
export const openVkPageOfProduct = async (marketId: number) => {
    return await HttpService.getMarketUrl(marketId)
        .then((response) => {
            let url = response.data.url;
            window.open(url, "_blank");
        })
        .catch((error) => {
            toast("Ошибка получения ссылки на товар!");
            return error;
        })
}