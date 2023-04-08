import { Error } from "entities";
import { InventoryRequestBody } from "services/request-bodies";
import { BaseApi } from "shared/api/lib";
import api from "shared/config/axios";

export class InventoryApi extends BaseApi {
    protected baseURL = "/inventory";

    async send(body: InventoryRequestBody): Promise<void | Error> {
        try {
            await api.post<string>(this.baseURL, body);
        } catch (error) {
            return this.handleError(error);
        }
    }
}
