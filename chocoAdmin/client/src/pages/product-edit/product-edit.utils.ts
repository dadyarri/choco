import {Product, ProductCategory} from "../../services/types";
import HttpService from "../../services/http";
import {toast} from "react-toastify";

export const getProductById = async (productId: string): Promise<Product> => {
    return await HttpService.getProductById(productId)
        .then((response) => response.data)
        .catch((error) => {
            toast("Ошибка получения информации о товаре!");
            return error;
        });
}

export const getProductCategories = async (): Promise<ProductCategory[]> => {
    return await HttpService.getProductCategories()
        .then((response) => response.data)
        .catch((error) => {
            toast("Ошибка получения списка категорий товара!");
            return error;
        })
}