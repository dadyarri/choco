import { UpdateShipmentRequestBody } from "services/request-bodies";
import { shipments } from "shared/api";
import { sendToast } from "shared/lib";

export const getShipments = async () => {
    return shipments
        .getAll()
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения списка поставок");
        });
};

export const getShipmentById = async (id: string) => {
    return shipments
        .getById(id)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка получения поставки");
            throw error;
        });
};

export const createShipment = async (model: UpdateShipmentRequestBody) => {
    return shipments
        .create(model)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка создания поставки");
        });
};

export const updateShipment = async (id: string, model: UpdateShipmentRequestBody) => {
    return shipments
        .update(id, model)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка обновления поставки");
        });
};

export const deleteShipment = async (id: string) => {
    return shipments
        .delete(id)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка удаления поставки");
        });
};

export const restoreShipment = async (id: string) => {
    return shipments
        .restore(id)
        .then((data) => data)
        .catch((error) => {
            sendToast(error, "Ошибка восстановления поставки");
        });
};
