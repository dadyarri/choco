import {toast} from "react-toastify";

import {Shipment} from "entities/shipment";
import {ShipmentStatus} from "entities/shipment-status";
import HttpService from "services/http";
import {UpdateShipmentRequestBody} from "services/request-bodies";


export const getShipmentById = async (shipmentId: string): Promise<Shipment> => {
    return await HttpService.getShipmentById(shipmentId)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения данных о поставке!
            ${error?.response.data}`);
            throw error;
        });

};

export const fetchProductsList = async () => {
    return await HttpService.getProducts()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения списка товаров!
            ${error?.response.data}`);
            throw error;
        });
};

export const fetchShipmentStatusesList = async (): Promise<ShipmentStatus[]> => {
    return await HttpService.getShipmentStatuses()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения списка статусов поставок!
            ${error?.response.data}`);
            throw error;
        });
};


export const updateShipment = async (shipmentId: string, values: UpdateShipmentRequestBody): Promise<ShipmentStatus> => {
    return await HttpService.updateShipment(shipmentId, values)
        .then((response) => {
            toast("Поставка обновлена!");
            return response.data;
        })
        .catch((error) => {
            toast(`Ошибка обновления поставки!
${error?.response.data}`);
            throw error;
        });
};

export const createShipment = async (values: UpdateShipmentRequestBody): Promise<Shipment> => {
    return await HttpService.createShipment(values)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка создания поставки!
            ${error?.response.data}`);
            throw error;
        });
};