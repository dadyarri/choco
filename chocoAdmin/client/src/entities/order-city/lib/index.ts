import { toast } from "react-toastify";

import { orderCities } from "shared/api";

export const getOrderCities = async () => {
    return orderCities
        .getAll()
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения списка городов: ${error.message}`);
            throw error;
        });
};
