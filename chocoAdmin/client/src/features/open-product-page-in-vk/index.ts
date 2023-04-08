import { toast } from "react-toastify";

import {Error} from "entities";
import { vk } from "shared/api";
import { errorHappened } from "shared/lib";



export const openProductPageInVk = async (marketId: number) => {
  vk.getMarketId(marketId).then((data) => {
    if (errorHappened(data)) {
      data = data as Error;
      toast(`Ошибка получения ссылки на товар: ${data.message}`);
      throw data.error;
    } else {
      window.open(data as string, "_blank");
    }
  });
};