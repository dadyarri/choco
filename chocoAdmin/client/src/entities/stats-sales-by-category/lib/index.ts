import { toast } from "react-toastify";

import { Error } from "entities";
import { stats } from "shared/api";
import { errorHappened } from "shared/lib";


export const getSalesByCategory = () => {
    stats.getSalesByCategory().then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка получения статистики продаж по категориям: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};
