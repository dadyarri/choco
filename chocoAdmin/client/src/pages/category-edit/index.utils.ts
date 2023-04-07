import {ProductCategory} from "entities";
import HttpService from "services/http";
import {toast} from "react-toastify";
import {UpdateProductCategoryRequestBody} from "services/request-bodies";

export const getProductCategoryById = async (productCategoryId: string): Promise<ProductCategory> => {
    return await HttpService.getProductCategoryById(productCategoryId)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения информации о категории!
            ${error?.response.data}`);
            throw error;
        });
}

export const updateProductCategory = async (itemId: string, body: UpdateProductCategoryRequestBody): Promise<ProductCategory> => {
    return await HttpService.updateProductCategory(itemId, body)
        .then((response) => {
            toast("Категория успешно обновлена!");
            return response.data
        })
        .catch((error) => {
            toast(`Ошибка обновления категории!
            ${error?.response.data}`);
            throw error;
        })
}

export const createProductCategory = async (body: UpdateProductCategoryRequestBody): Promise<ProductCategory> => {
    return await HttpService.createProductCategory(body)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка создания категории!
            ${error?.response.data}`);
            throw error;
        })
}