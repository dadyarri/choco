import { toast } from "react-toastify";

import { Error } from "entities";
import { orderStatuses } from "shared/api";
import { errorHappened } from "shared/lib";

export const getOrderStatuses = async () => {
    orderStatuses.getAll().then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка получения списка статусов заказа: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};
