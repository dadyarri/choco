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
export const openVkPageOfProduct = (marketId: number) => {
}