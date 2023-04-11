import { orderCities } from "shared/api";
import { sendSnackbar } from "shared/lib";

export const getOrderCities = async () => {
    return orderCities
        .getAll()
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения списка городов");
            throw error;
        });
};
