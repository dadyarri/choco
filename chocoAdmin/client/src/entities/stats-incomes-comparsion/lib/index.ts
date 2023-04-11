import { stats } from "shared/api";
import { sendSnackbar } from "shared/lib";

export const getIncomesComparsion = (months: number) => {
    return stats
        .getIncomesComparsionByNMonths(months)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения сравнения доходов за ${months} месяц(ев)");
            throw error;
        });
};
