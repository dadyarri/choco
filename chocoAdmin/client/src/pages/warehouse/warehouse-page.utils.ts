import HttpService from "../../services/http";
import {toast} from "react-toastify";

export const fetchProductsList = async () => {
    return await HttpService.getProducts()
        .then((response) => response.data)
        .catch((error) => {
            toast('Ошибка получения данных!');
        })
}

export const openEditModal = (id: string) => {
}
export const deleteConfirm = (id: string) => {
}
export const openVkPageOfProduct = (marketId: number) => {
}