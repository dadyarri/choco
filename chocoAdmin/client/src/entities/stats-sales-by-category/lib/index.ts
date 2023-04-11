import { stats } from "shared/api";
import { sendToast } from "shared/lib";

export const getSalesByCategory = () => {
    return stats
        .getSalesByCategory()
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения статистики продаж по категориям");
        });
};
