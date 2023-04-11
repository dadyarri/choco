import { UpdateOrderRequestBody } from "services/request-bodies";
import { orders } from "shared/api";
import { sendToast } from "shared/lib";

export const getOrders = async () => {
    return orders
        .getAll()
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения списка заказов");
        });
};

export const getOrderById = async (id: string) => {
    return orders
        .getById(id)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения заказа");
        });
};

export const createOrder = async (model: UpdateOrderRequestBody) => {
    return orders
        .create(model)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка создания заказа");
        });
};

export const updateOrder = async (id: string, model: UpdateOrderRequestBody) => {
    return orders
        .update(id, model)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка обновления заказа");
        });
};

export const deleteOrder = async (id: string) => {
    return orders
        .delete(id)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка удаления заказа");
        });
};

export const restoreOrder = async (id: string) => {
    return orders
        .restore(id)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка восстановления заказа");
        });
};
