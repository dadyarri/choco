import { shipmentStatuses } from "shared/api";
import { sendSnackbar } from "shared/lib";

export const getShipmentStatuses = async () => {
    return shipmentStatuses
        .getAll()
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения статусов поставки");
            throw error;
        });
};
