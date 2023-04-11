import { UpdateShipmentRequestBody } from "services/request-bodies";
import { shipments } from "shared/api";
import { sendSnackbar } from "shared/lib";

export const getShipments = async () => {
    return shipments
        .getAll()
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения списка поставок");
            throw error;
        });
};

export const getShipmentById = async (id: string) => {
    return shipments
        .getById(id)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка получения поставки");
            throw error;
            throw error;
        });
};

export const createShipment = async (model: UpdateShipmentRequestBody) => {
    return shipments
        .create(model)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка создания поставки");
            throw error;
        });
};

export const updateShipment = async (id: string, model: UpdateShipmentRequestBody) => {
    return shipments
        .update(id, model)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка обновления поставки");
            throw error;
        });
};

export const deleteShipment = async (id: string) => {
    return shipments
        .delete(id)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка удаления поставки");
            throw error;
        });
};

export const restoreShipment = async (id: string) => {
    return shipments
        .restore(id)
        .then((data) => data)
        .catch((error) => {
            sendSnackbar(error, "Ошибка восстановления поставки");
            throw error;
        });
};
