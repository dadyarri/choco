import { toast } from "react-toastify";

import { Error } from "entities";
import { stats } from "shared/api";
import { errorHappened } from "shared/lib";

export const getIncomesComparsion = (months: number) => {
    stats.getIncomesComparsionByNMonths(months).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка получения сравнения доходов за ${months} месяц(ев): ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};
