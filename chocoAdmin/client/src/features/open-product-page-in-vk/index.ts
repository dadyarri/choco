import { vk } from "shared/api";
import { sendToast } from "shared/lib";

export const openProductPageInVk = async (marketId: number) => {
    return vk.getMarketId(marketId)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения ссылки на товар");
        });
};
