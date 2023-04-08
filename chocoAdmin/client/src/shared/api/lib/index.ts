import { AxiosError, isAxiosError } from "axios";

import { Error } from "entities/error";
import api from "shared/config/axios";

export abstract class Api<TModel, TRequestBody> {
    protected baseURL = "";
    async getAll(): Promise<TModel[] | Error> {
        try {
            const { data } = await api.get<TModel[]>(this.baseURL);
            return data;
        } catch (error) {
            return this.handleError(error);
        }
    }
    async getById(id: string): Promise<TModel | Error> {
        try {
            const { data } = await api.get<TModel>(`${this.baseURL}/${id}`);
            return data;
        } catch (error) {
            return this.handleError(error);
        }
    }
    async create(model: TRequestBody): Promise<TModel | Error> {
        try {
            const { data } = await api.post<TModel>(this.baseURL, model);
            return data;
        } catch (error) {
            return this.handleError(error);
        }
    }
    async update(id: string, model: TRequestBody): Promise<TModel | Error> {
        try {
            const { data } = await api.patch<TModel>(`${this.baseURL}/${id}`, model);
            return data;
        } catch (error) {
            return this.handleError(error);
        }
    }
    async delete(id: string): Promise<void | Error> {
        try {
            await api.delete(`${this.baseURL}/${id}`);
        } catch (error) {
            return this.handleError(error);
        }
    }
    async restore(id: string): Promise<void | Error> {
        try {
            await api.put(`${this.baseURL}/${id}`);
        } catch (error) {
            return this.handleError(error);
        }
    }

    private handleError(error: AxiosError | unknown): Error {
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
