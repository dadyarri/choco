import {Product, ProductCategory} from "../../services/types";
import HttpService from "../../services/http";
import {toast} from "react-toastify";
import {UpdateProductRequestBody} from "../../services/request-bodies";

export const getProductById = async (productId: string): Promise<Product> => {
    return await HttpService.getProductById(productId)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения информации о товаре!
            ${error?.response.data}`);
            throw error;
        });
}

export const getProductCategories = async (): Promise<ProductCategory[]> => {
    return await HttpService.getProductCategories()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения списка категорий товара!
            ${error?.response.data}`);
            throw error;
        })
}

export const updateProduct = async (itemId: string, body: UpdateProductRequestBody): Promise<Product> => {
    return await HttpService.updateProduct(itemId, body)
        .then((response) => {
            toast("Заказ успешно обновлён!");
            return response.data
        })
        .catch((error) => {
            toast(`Ошибка обновления товара!
            ${error?.response.data}`);
            throw error;
        })
}

export const createProduct = async (body: UpdateProductRequestBody): Promise<Product> => {
    return await HttpService.createProduct(body)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка создания товара!
            ${error?.response.data}`);
            throw error;
        })
}