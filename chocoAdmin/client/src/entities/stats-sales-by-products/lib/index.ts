import { toast } from "react-toastify";

import { Error } from "entities";
import { stats } from "shared/api";
import { errorHappened } from "shared/lib";

export const getSalesByProducts = () => {
  stats.getSalesByProducts().then((data) => {
    if (errorHappened(data)) {
      data = data as Error;
      toast(`Ошибка получения статистики продаж по товарам: ${data.message}`);
      throw data.error;
    } else {
      return data;
    }
  });
};
