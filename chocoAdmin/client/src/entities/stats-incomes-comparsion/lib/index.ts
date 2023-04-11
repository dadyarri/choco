import { stats } from "shared/api";
import { sendToast } from "shared/lib";

export const getIncomesComparsion = (months: number) => {
    return stats
        .getIncomesComparsionByNMonths(months)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения сравнения доходов за ${months} месяц(ев)");
        });
};
