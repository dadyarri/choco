import { toast } from "react-toastify";

import { Error } from "entities";
import { UpdateProductRequestBody } from "services/request-bodies";
import { productCategories } from "shared/api";
import { errorHappened } from "shared/lib";

export const getProductCategories = async () => {
    productCategories.getAll().then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка получения списка категорий: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};
export const getProductCategoryById = async (id: string) => {
    productCategories.getById(id).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка получения категории: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

export const createProductCategory = async (model: UpdateProductRequestBody) => {
    productCategories.create(model).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка создания категории: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

export const updateProductCategory = async (id: string, model: UpdateProductRequestBody) => {
    productCategories.update(id, model).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка обновления категории: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

export const deleteProductCategory = async (id: string) => {
    productCategories.delete(id).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка удаления категории: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};

export const restoreProductCategory = async (id: string) => {
    productCategories.restore(id).then((data) => {
        if (errorHappened(data)) {
            data = data as Error;
            toast(`Ошибка восстановления категории: ${data.message}`);
            throw data.error;
        } else {
            return data;
        }
    });
};
