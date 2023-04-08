import { toast } from "react-toastify";

import { Error } from "entities";
import { shipmentStatuses } from "shared/api";
import { errorHappened } from "shared/lib";

const getShipmentStatuses = async () => {
    shipmentStatuses.getAll().then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка получения статусов поставки: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};
