import { toast } from "react-toastify";

import { Error } from "entities";
import { stats } from "shared/api";
import { errorHappened } from "shared/lib";

export const getSalesByCity = () => {
    stats.getSalesByCity().then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка получения статистики продаж по городам: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};
