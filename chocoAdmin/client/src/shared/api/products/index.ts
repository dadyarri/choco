import {Product} from "entities/product";
import {UpdateProductRequestBody} from "services/request-bodies";
import api from "shared/config/axios";
import {handleError} from "shared/api/helpers";

const baseURL: string = '/products';

export const getAll = async () => {
    try {
        const {data} = await api.get<Product[]>(baseURL);
        return data;
    } catch (error) {
        return handleError(error);
    }
};

export const getById = async (id: string) => {
    try {
        const {data} = await api.get<Product>(`${baseURL}/${id}`);
        return data;
    } catch (error) {
        return handleError(error);
    }
};

export const create = async (productInput: UpdateProductRequestBody) => {
    try {
        const {data} = await api.post<Product>(baseURL, productInput);
        return data;
    } catch (error) {
        return handleError(error);
    }
};

export const update = async (id: string, productInput: UpdateProductRequestBody) => {
    try {
        const {data} = await api.patch<Product>(`${baseURL}/${id}`, productInput);
        return data;
    } catch (error) {
        return handleError(error);
    }
};

export const del = async (id: string) => {
    try {
        await api.delete(`${baseURL}/${id}`);
    } catch (error) {
        return handleError(error);
    }
};

export const restore = async (id: string) => {
    try {
        await api.put(`${baseURL}/${id}`);
    } catch (error) {
        return handleError(error)
    }
}
