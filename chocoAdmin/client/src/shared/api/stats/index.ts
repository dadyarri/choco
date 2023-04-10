import {
    StatsIncomesComparsion,
    StatsSalesByCategory,
    StatsSalesByCity,
    StatsSalesByProduct,
} from "entities";
import { BaseApi } from "shared/api/lib";
import api from "shared/config/axios";

export class StatsApi extends BaseApi {
    protected baseURL = "/stats";

    async getSalesByCity() {
        try {
            const { data } = await api.get<StatsSalesByCity>(`${this.baseURL}/byCity`);
            return data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getSalesByCategory() {
        try {
            const { data } = await api.get<StatsSalesByCategory>(`${this.baseURL}/byCategory`);
            return data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getSalesByProducts() {
        try {
            const { data } = await api.get<StatsSalesByProduct>(`${this.baseURL}/topProducts`);
            return data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getIncomesComparsionByNMonths(months: number) {
        try {
            const { data } = await api.get<StatsIncomesComparsion>(
                `${this.baseURL}/totalIncomes/${months}`,
            );
            return data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
}
