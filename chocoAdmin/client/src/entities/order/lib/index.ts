import { toast } from "react-toastify";

import { UpdateOrderRequestBody } from "services/request-bodies";
import { orders } from "shared/api";

export const getOrders = async () => {
    return orders
        .getAll()
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения списка заказов: ${error.message}`);
            throw error;
        });
};

export const getOrderById = async (id: string) => {
    return orders
        .getById(id)
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения заказа: ${error.message}`);
            throw error;
        });
};

export const createOrder = async (model: UpdateOrderRequestBody) => {
    return orders
        .create(model)
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка создания заказа: ${error.message}`);
            throw error;
        });
};

export const updateOrder = async (id: string, model: UpdateOrderRequestBody) => {
    return orders
      .update(id, model)
      .then((data) => data)
      .catch((error) => {
          toast(`Ошибка обновления заказа: ${error.message}`);
          throw error;
      });
};

export const deleteOrder = async (id: string) => {
    return orders
      .delete(id)
      .then((data) => data)
      .catch((error) => {
          toast(`Ошибка удаления заказа: ${error.message}`);
          throw error;
      });
};

export const restoreOrder = async (id: string) => {
    return orders
      .restore(id)
      .then((data) => data)
      .catch((error) => {
          toast(`Ошибка восстановления заказа: ${error.message}`);
          throw error;
      });
};
