import { Error } from "entities";
import { BaseApi } from "shared/api/lib";
import api from "shared/config/axios";

export class VkApi extends BaseApi {
    protected baseURL = "/vk";

    async getMarketId(marketId: number): Promise<string | Error> {
        try {
            const { data } = await api.get<string>(`${this.baseURL}/productUrl/${marketId}`);
            return data;
        } catch (error) {
            return this.handleError(error);
        }
    }
}
