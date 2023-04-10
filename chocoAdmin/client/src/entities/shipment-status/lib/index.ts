import { toast } from "react-toastify";

import { shipmentStatuses } from "shared/api";

export const getShipmentStatuses = async () => {
    return shipmentStatuses
        .getAll()
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения статусов поставки: ${error.message}`);
            throw error;
        });
};
