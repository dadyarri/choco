import { UpdateProductCategoryRequestBody } from "services/request-bodies";
import { productCategories } from "shared/api";
import { sendSnackbar } from "shared/lib";

export const getProductCategories = async () => {
    return productCategories
        .getAll()
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения списка категорий");
            throw error;
        });
};
export const getProductCategoryById = async (id: string) => {
    return productCategories
        .getById(id)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения категории");
            throw error;
        });
};

export const createProductCategory = async (model: UpdateProductCategoryRequestBody) => {
    return productCategories
        .create(model)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка создания категории");
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
            sendSnackbar(error, "Ошибка обновления категории");
            throw error;
        });
};

export const deleteProductCategory = async (id: string) => {
    return productCategories
        .delete(id)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка удаления категории");
            throw error;
        });
};

export const restoreProductCategory = async (id: string) => {
    return productCategories
        .restore(id)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка восстановления категории");
            throw error;
        });
};
