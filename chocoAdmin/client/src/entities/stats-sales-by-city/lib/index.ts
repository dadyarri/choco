import { stats } from "shared/api";
import { sendSnackbar } from "shared/lib";

export const getSalesByCity = () => {
    return stats
        .getSalesByCity()
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения статистики продаж по городам");
            throw error;
        });
};
