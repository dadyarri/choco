import { UpdateProductCategoryRequestBody } from "services/request-bodies";
import { productCategories } from "shared/api";
import { sendToast } from "shared/lib";

export const getProductCategories = async () => {
    return productCategories
        .getAll()
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения списка категорий");
        });
};
export const getProductCategoryById = async (id: string) => {
    return productCategories
        .getById(id)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения категории");
        });
};

export const createProductCategory = async (model: UpdateProductCategoryRequestBody) => {
    return productCategories
        .create(model)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка создания категории");
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
            sendToast(error, "Ошибка обновления категории");
        });
};

export const deleteProductCategory = async (id: string) => {
    return productCategories
        .delete(id)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка удаления категории");
        });
};

export const restoreProductCategory = async (id: string) => {
    return productCategories
        .restore(id)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка восстановления категории");
        });
};
