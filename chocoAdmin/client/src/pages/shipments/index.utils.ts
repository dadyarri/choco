import {Shipment} from "entities";
import HttpService from "services/http";
import {toast} from "react-toastify";

export const fetchShipmentsList = async (): Promise<Shipment[]> => {
    return await HttpService.getShipments()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения списка поставок!
            ${error?.response.data}`);
            throw error;
        })
}

export const deleteShipment = async (shipmentId: string) => {
    return await HttpService.deleteShipment(shipmentId)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка удаления поставки!
            ${error?.response.data}`);
            throw error;
        })
}

export const restoreFromDeleted = async (orderId: string) => {
    return await HttpService.restoreShipmentFromDeleted(orderId)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка восстановления поставки
            ${error?.response.data}`);
            throw error;
        })
}