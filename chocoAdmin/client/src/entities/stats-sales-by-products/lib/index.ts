import { stats } from "shared/api";
import { sendToast } from "shared/lib";

export const getSalesByProducts = () => {
    return stats
        .getSalesByProducts()
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения статистики продаж по товарам");
            throw error;
        });
};
