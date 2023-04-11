import { BaseApi } from "shared/api/lib";
import api from "shared/config/axios";

export class VkApi extends BaseApi {
    protected baseURL = "/vk";

    async getMarketId(marketId: number) {
        try {
            const { data } = await api.get<string>(`${this.baseURL}/productUrl/${marketId}`);
            return data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
}
