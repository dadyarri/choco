import { toast } from "react-toastify";

import { Error } from "entities";
import { UpdateShipmentRequestBody } from "services/request-bodies";
import { shipments } from "shared/api";
import { errorHappened } from "shared/lib";

const getShipments = async () => {
    shipments.getAll().then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка получения списка поставок: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const getShipmentById = async (id: string) => {
    shipments.getById(id).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка получения поставки: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const createShipment = async (model: UpdateShipmentRequestBody) => {
    shipments.create(model).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка создания поставки: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const updateShipment = async (id: string, model: UpdateShipmentRequestBody) => {
    shipments.update(id, model).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка обновления поставки: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const deleteShipment = async (id: string) => {
    shipments.delete(id).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка удаления поставки: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const restoreShipment = async (id: string) => {
    shipments.restore(id).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка восстановления поставки: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};
