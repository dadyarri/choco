import { stats } from "shared/api";
import { sendToast } from "shared/lib";

export const getSalesByCity = () => {
    return stats
        .getSalesByCity()
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения статистики продаж по городам");
            throw error;
        });
};
