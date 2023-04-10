import { toast } from "react-toastify";

import { stats } from "shared/api";

export const getSalesByProducts = () => {
    return stats
        .getSalesByProducts()
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения статистики продаж по товарам: ${error.message}`);
            throw error;
        });
};
