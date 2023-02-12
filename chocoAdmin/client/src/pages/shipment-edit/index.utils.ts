import {Shipment, ShipmentStatus} from "../../services/types";
import HttpService from "../../services/http";
import {toast} from "react-toastify";

export const getShipmentById = async (orderId: string): Promise<Shipment> => {
    return await HttpService.getShipmentById(orderId)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения данных!
            ${error?.response.data}`);
            return error
        })

}

export const fetchShipmentStatusesList = async (): Promise<ShipmentStatus[]> => {
    return await HttpService.getShipmentStatuses()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения данных!
            ${error?.response.data}`);
            return error;
        })
}


export const updateShipment = async (orderId: string, values: UpdateShipmentRequestBody): Promise<ShipmentStatus> => {
    return await HttpService.updateOrder(orderId, values)
        .then((response) => {
            toast("Заказ обновлён!")
            return response.data
        })
        .catch((error) => {
            toast(`Ошибка обновления заказа!
${error?.response.data}`);
            return error;
        })
}

export const createShipment = async (values: UpdateShipmentRequestBody): Promise<Shipment> => {
    return await HttpService.createOrder(values)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка создания заказа!
            ${error?.response.data}`);
            return error;
        })
}