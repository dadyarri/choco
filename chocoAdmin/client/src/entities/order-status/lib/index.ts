import { orderStatuses } from "shared/api";
import { sendToast } from "shared/lib";

export const getOrderStatuses = async () => {
    return orderStatuses
        .getAll()
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения списка статусов заказа");
        });
};
