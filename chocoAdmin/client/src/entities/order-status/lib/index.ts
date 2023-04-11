import { orderStatuses } from "shared/api";
import { sendSnackbar } from "shared/lib";

export const getOrderStatuses = async () => {
    return orderStatuses
        .getAll()
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения списка статусов заказа");
            throw error;
        });
};
