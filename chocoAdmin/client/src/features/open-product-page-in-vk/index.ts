import { vk } from "shared/api";
import { sendSnackbar } from "shared/lib";

export const openProductPageInVk = async (marketId: number) => {
    return vk
        .getMarketId(marketId)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения ссылки на товар");
            throw error;
        });
};
