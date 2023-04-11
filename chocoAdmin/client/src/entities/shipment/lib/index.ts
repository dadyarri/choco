import { toast } from "react-toastify";

import { UpdateShipmentRequestBody } from "services/request-bodies";
import { shipments } from "shared/api";

export const getShipments = async () => {
    return shipments
        .getAll()
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения списка поставок: ${error.message}`);
            throw error;
        });
};

export const getShipmentById = async (id: string) => {
    return shipments
        .getById(id)
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения поставки: ${error.message}`);
            throw error;
        });
};

export const createShipment = async (model: UpdateShipmentRequestBody) => {
    return shipments
        .create(model)
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка создания поставки: ${error.message}`);
            throw error;
        });
};

export const updateShipment = async (id: string, model: UpdateShipmentRequestBody) => {
    return shipments
        .update(id, model)
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка обновления поставки: ${error.message}`);
            throw error;
        });
};

export const deleteShipment = async (id: string) => {
    return shipments
        .delete(id)
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка удаления поставки: ${error.message}`);
            throw error;
        });
};

export const restoreShipment = async (id: string) => {
    return shipments
        .restore(id)
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка восстановления поставки: ${error.message}`);
            throw error;
        });
};
