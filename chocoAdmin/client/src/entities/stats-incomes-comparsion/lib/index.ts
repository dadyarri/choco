import { toast } from "react-toastify";

import { stats } from "shared/api";

export const getIncomesComparsion = (months: number) => {
    return stats
        .getIncomesComparsionByNMonths(months)
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения сравнения доходов за ${months} месяц(ев): ${error.message}`);
            throw error;
        });
};
