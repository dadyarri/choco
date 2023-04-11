import { UpdateOrderRequestBody } from "services/request-bodies";
import { orders } from "shared/api";
import { sendSnackbar } from "shared/lib";

export const getOrders = async () => {
    return orders
        .getAll()
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения списка заказов");
            throw error;
        });
};

export const getOrderById = async (id: string) => {
    return orders
        .getById(id)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения заказа");
            throw error;
        });
};

export const createOrder = async (model: UpdateOrderRequestBody) => {
    return orders
        .create(model)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка создания заказа");
            throw error;
        });
};

export const updateOrder = async (id: string, model: UpdateOrderRequestBody) => {
    return orders
        .update(id, model)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка обновления заказа");
            throw error;
        });
};

export const deleteOrder = async (id: string) => {
    return orders
        .delete(id)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка удаления заказа");
            throw error;
        });
};

export const restoreOrder = async (id: string) => {
    return orders
        .restore(id)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка восстановления заказа");
            throw error;
        });
};
