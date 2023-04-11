import { toast } from "react-toastify";

import { vk } from "shared/api";

export const openProductPageInVk = async (marketId: number) => {
    vk.getMarketId(marketId)
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения ссылки на товар: ${error.message}`);
            throw error;
        });
};
