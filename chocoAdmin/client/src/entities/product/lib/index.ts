import { toast } from "react-toastify";

import { Error } from "entities";
import { InventoryRequestBody, UpdateProductRequestBody } from 'services/request-bodies';
import { inventory, products } from "shared/api";
import { errorHappened } from "shared/lib";

const getProducts = async () => {
    products.getAll().then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка получения списка товаров: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const getProductById = async (id: string) => {
    products.getById(id).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка получения товара: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const createProduct = async (model: UpdateProductRequestBody) => {
    products.create(model).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка создания товара: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const updateProduct = async (id: string, model: UpdateProductRequestBody) => {
    products.update(id, model).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка обновления товара: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const deleteProduct = async (id: string) => {
    products.delete(id).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка удаления товара: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const restoreProduct = async (id: string) => {
    products.restore(id).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка восстановления товара: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

const sendInventory = async (body: InventoryRequestBody) => {
    inventory.send(body).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка проведения ревизии: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};
