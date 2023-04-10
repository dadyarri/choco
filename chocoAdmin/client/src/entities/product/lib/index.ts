import { toast } from "react-toastify";

import { InventoryRequestBody, UpdateProductRequestBody } from "services/request-bodies";
import { inventory, products } from "shared/api";

export const getProducts = async () => {
    return products
        .getAll()
        .then((data) => data)
        .catch((error) => {
            toast(`Ошибка получения списка товаров: ${error.message}`);
            throw error;
        });
};

export const getProductById = async (id: string) => {
    return products
      .getById(id)
      .then((data) => data)
      .catch((error) => {
          toast(`Ошибка получения товара: ${error.message}`);
          throw error;
      });
};

export const createProduct = async (model: UpdateProductRequestBody) => {
    return products
      .create(model)
      .then((data) => data)
      .catch((error) => {
          toast(`Ошибка создания товара: ${error.message}`);
          throw error;
      });
};

export const updateProduct = async (id: string, model: UpdateProductRequestBody) => {
    return products
      .update(id, model)
      .then((data) => data)
      .catch((error) => {
          toast(`Ошибка обновления товара: ${error.message}`);
          throw error;
      });
};

export const deleteProduct = async (id: string) => {
    return products
      .delete(id)
      .then((data) => data)
      .catch((error) => {
          toast(`Ошибка удаления товара: ${error.message}`);
          throw error;
      });
};

export const restoreProduct = async (id: string) => {
    return products
      .restore(id)
      .then((data) => data)
      .catch((error) => {
          toast(`Ошибка восстановления товара: ${error.message}`);
          throw error;
      });
};

export const sendInventory = async (body: InventoryRequestBody) => {
    return inventory
      .send(body)
      .then((data) => data)
      .catch((error) => {
          toast(`Ошибка проведения ревизии: ${error.message}`);
          throw error;
      });
};
