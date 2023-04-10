import { toast } from "react-toastify";

import { orderStatuses } from "shared/api";

export const getOrderStatuses = async () => {
    return orderStatuses
        .getAll()
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения списка статусов заказа: ${error.message}`);
            throw error;
        });
};
