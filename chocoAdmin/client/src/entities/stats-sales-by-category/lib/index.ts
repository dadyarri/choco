import { toast } from "react-toastify";

import { stats } from "shared/api";

export const getSalesByCategory = () => {
    return stats
        .getSalesByCategory()
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения статистики продаж по категориям: ${error.message}`);
            throw error;
        });
};
