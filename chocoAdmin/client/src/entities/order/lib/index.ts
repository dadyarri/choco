import { toast } from "react-toastify";

import { Error } from "entities";
import { UpdateOrderRequestBody } from "services/request-bodies";
import { orders } from "shared/api";
import { errorHappened } from "shared/lib";

const getOrders = async () => {
    orders.getAll().then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка получения списка заказов: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const getOrderById = async (id: string) => {
    orders.getById(id).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка получения заказа: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const createOrder = async (model: UpdateOrderRequestBody) => {
    orders.create(model).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка создания заказа: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const updateOrder = async (id: string, model: UpdateOrderRequestBody) => {
    orders.update(id, model).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка обновления заказа: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const deleteOrder = async (id: string) => {
    orders.delete(id).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка удаления заказа: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const restoreOrder = async (id: string) => {
    orders.restore(id).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка восстановления заказа: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};
