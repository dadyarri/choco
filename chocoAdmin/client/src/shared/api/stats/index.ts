import {
    Error,
    StatsSalesByCity,
    StatsIncomesComparsion,
    StatsSalesByCategory,
    StatsSalesByProduct,
} from "entities";
import { BaseApi } from "shared/api/lib";
import api from "shared/config/axios";

export class StatsApi extends BaseApi {
    protected baseURL = "/stats";

    async getSalesByCity(): Promise<StatsSalesByCity | Error> {
        try {
            const { data } = await api.get<StatsSalesByCity>(`${this.baseURL}/byCity`);
            return data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getSalesByCategory(): Promise<StatsSalesByCategory | Error> {
        try {
            const { data } = await api.get<StatsSalesByCategory>(`${this.baseURL}/byCategory`);
            return data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getSalesByProducts(): Promise<StatsSalesByProduct | Error> {
        try {
            const { data } = await api.get<StatsSalesByProduct>(`${this.baseURL}/topProducts`);
            return data;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getIncomesComparsionByNMonths(months: number): Promise<StatsIncomesComparsion | Error> {
        try {
            const { data } = await api.get<StatsIncomesComparsion>(
                `${this.baseURL}/totalIncomes/${months}`,
            );
            return data;
        } catch (error) {
            return this.handleError(error);
        }
    }
}
