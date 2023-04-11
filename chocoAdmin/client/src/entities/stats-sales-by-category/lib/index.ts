import { stats } from "shared/api";
import { sendSnackbar } from "shared/lib";

export const getSalesByCategory = () => {
    return stats
        .getSalesByCategory()
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения статистики продаж по категориям");
            throw error;
        });
};
