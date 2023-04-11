import { stats } from "shared/api";
import { sendSnackbar } from "shared/lib";

export const getSalesByProducts = () => {
    return stats
        .getSalesByProducts()
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения статистики продаж по товарам");
            throw error;
        });
};
