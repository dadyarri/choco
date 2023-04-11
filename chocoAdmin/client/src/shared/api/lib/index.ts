import { AxiosError, isAxiosError } from "axios";

import { Error } from "entities/error";
import { auth } from "features";
import api from "shared/config/axios";

export abstract class BaseApi {
    protected handleError(error: AxiosError | unknown): Error {
        let message: string;
        if (isAxiosError(error)) {
            if (error.response) {
                message = `API Error (${error.response.status}): ${error.response.data}`;
                console.error(message);
            } else if (error.request) {
                message = "API Error (No Response)";
                console.error(message, error.request);
            } else {
                message = "API Error";
                console.error(message, error.message);
            }
        } else {
            message = "Unexpected Error";
            console.error(message, error);
        }
        return { message: message, error: error };
    }
}

export abstract class ModelApi<TModel, TRequestBody> extends BaseApi {
    protected baseURL = "";

    async getAll() {
        try {
            const { data } = await api.get<TModel[]>(this.baseURL, {
                headers: { Authorization: `Bearer: ${auth.getToken()}` },
            });
            return data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getById(id: string) {
        try {
            const { data } = await api.get<TModel>(`${this.baseURL}/${id}`, {
                headers: { Authorization: `Bearer: ${auth.getToken()}` },
            });
            return data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async create(model: TRequestBody) {
        try {
            const { data } = await api.post<TModel>(this.baseURL, model, {
                headers: { Authorization: `Bearer: ${auth.getToken()}` },
            });
            return data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async update(id: string, model: TRequestBody) {
        try {
            const { data } = await api.patch<TModel>(`${this.baseURL}/${id}`, model, {
                headers: { Authorization: `Bearer: ${auth.getToken()}` },
            });
            return data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async delete(id: string) {
        try {
            await api.delete(`${this.baseURL}/${id}`, {
                headers: { Authorization: `Bearer: ${auth.getToken()}` },
            });
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async restore(id: string) {
        try {
            await api.put(`${this.baseURL}/${id}`, {
                headers: { Authorization: `Bearer: ${auth.getToken()}` },
            });
        } catch (error) {
            throw this.handleError(error);
        }
    }
}
