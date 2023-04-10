import { toast } from "react-toastify";

import { stats } from "shared/api";

export const getSalesByCity = () => {
    return stats
        .getSalesByCity()
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения статистики продаж по городам: ${error.message}`);
            throw error;
        });
};
