import { orderCities } from "shared/api";
import { sendToast } from "shared/lib";

export const getOrderCities = async () => {
    return orderCities
        .getAll()
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения списка городов");
        });
};
