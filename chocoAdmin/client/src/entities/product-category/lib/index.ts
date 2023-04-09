import { toast } from "react-toastify";

import { UpdateProductCategoryRequestBody } from "services/request-bodies";
import { productCategories } from "shared/api";

export const getProductCategories = async () => {
    return productCategories
        .getAll()
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения списка категорий: ${error.message}`);
            throw error;
        });
};
export const getProductCategoryById = async (id: string) => {
    return productCategories
        .getById(id)
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения категории: ${error.message}`);
            throw error;
        });
};

export const createProductCategory = async (model: UpdateProductCategoryRequestBody) => {
    return productCategories
        .create(model)
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка создания категории: ${error.message}`);
            throw error;
        });
};

export const updateProductCategory = async (
    id: string,
    model: UpdateProductCategoryRequestBody,
) => {
    return productCategories
        .update(id, model)
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка обновления категории: ${error.message}`);
            throw error;
        });
};

export const deleteProductCategory = async (id: string) => {
    return productCategories
        .delete(id)
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка удаления категории: ${error.message}`);
            throw error;
        });
};

export const restoreProductCategory = async (id: string) => {
    return productCategories
        .restore(id)
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка восстановления категории: ${error.message}`);
            throw error;
        });
};
