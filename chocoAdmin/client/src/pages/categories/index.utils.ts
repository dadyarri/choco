import {ProductCategory} from "../../services/types";
import HttpService from "../../services/http";
import {toast} from "react-toastify";

export const fetchCategoriesList = async (): Promise<ProductCategory[]> => {
    return await HttpService.getProductCategories()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения данных!
            ${error?.response.data}`);
            return error;
        })
}