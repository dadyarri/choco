import { InventoryRequestBody, UpdateProductRequestBody } from "services/request-bodies";
import { inventory, products } from "shared/api";
import { sendToast } from "shared/lib";

export const getProducts = async () => {
    return products
        .getAll()
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения списка товаров");
        });
};

export const getProductById = async (id: string) => {
    return products
        .getById(id)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения товара");
        });
};

export const createProduct = async (model: UpdateProductRequestBody) => {
    return products
        .create(model)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка создания товара");
        });
};

export const updateProduct = async (id: string, model: UpdateProductRequestBody) => {
    return products
        .update(id, model)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка обновления товара");
        });
};

export const deleteProduct = async (id: string) => {
    return products
        .delete(id)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка удаления товара");
        });
};

export const restoreProduct = async (id: string) => {
    return products
        .restore(id)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка восстановления товара");
        });
};

export const sendInventory = async (body: InventoryRequestBody) => {
    return inventory
        .send(body)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка проведения ревизии");
        });
};
