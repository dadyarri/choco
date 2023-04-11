import { InventoryRequestBody, UpdateProductRequestBody } from "services/request-bodies";
import { inventory, products } from "shared/api";
import { sendSnackbar } from "shared/lib";

export const getProducts = async () => {
    return products
        .getAll()
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения списка товаров");
            throw error;
        });
};

export const getProductById = async (id: string) => {
    return products
        .getById(id)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения товара");
            throw error;
        });
};

export const createProduct = async (model: UpdateProductRequestBody) => {
    return products
        .create(model)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка создания товара");
            throw error;
        });
};

export const updateProduct = async (id: string, model: UpdateProductRequestBody) => {
    return products
        .update(id, model)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка обновления товара");
            throw error;
        });
};

export const deleteProduct = async (id: string) => {
    return products
        .delete(id)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка удаления товара");
            throw error;
        });
};

export const restoreProduct = async (id: string) => {
    return products
        .restore(id)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка восстановления товара");
            throw error;
        });
};

export const sendInventory = async (body: InventoryRequestBody) => {
    return inventory
        .send(body)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка проведения ревизии");
            throw error;
        });
};
