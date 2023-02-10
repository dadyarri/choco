import HttpService from "../../services/http";
import {toast} from "react-toastify";


export const getStatsByCity = async () => {
    return await HttpService.getStatsByCity().then(
        (response) => response.data
    ).catch((error) => {
        toast(`Ошибка получения данных
        ${error.data?.message}`);
    })
}

export const getTopProducts = async () => {
    return await HttpService.getTopProducts()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения данных
        ${error.data?.message}`);
            return error
        })
}