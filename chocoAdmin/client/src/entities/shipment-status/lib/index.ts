import { shipmentStatuses } from "shared/api";
import { sendToast } from "shared/lib";

export const getShipmentStatuses = async () => {
    return shipmentStatuses
        .getAll()
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения статусов поставки");
        });
};
