import { toast } from "react-toastify";

import { Error } from "entities";
import { orderCities } from "shared/api";
import { errorHappened } from "shared/lib";

export const getOrderCities = async () => {
    orderCities.getAll().then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка получения списка городов: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};
