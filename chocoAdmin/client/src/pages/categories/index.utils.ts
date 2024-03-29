import {ProductCategory} from "../../services/types";
import HttpService from "../../services/http";
import {toast} from "react-toastify";

export const fetchCategoriesList = async (): Promise<ProductCategory[]> => {
    return await HttpService.getProductCategories()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения списка категорий!
            ${error?.response.data}`);
            throw error;
        })
}

export const deleteCategory = async (categoryId: string) => {
    return await HttpService.deleteCategory(categoryId)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка удаления категории!
            ${error?.response.data}`);
            throw error;
        })
}

export const restoreCategory = async (categoryId: string) => {
    return await HttpService.restoreCategoryFromDeleted(categoryId)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка восстановления категории!
            ${error?.response.data}`);
            throw error;
        })
}