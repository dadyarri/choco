import { auth } from "features";
import { InventoryRequestBody } from "services/request-bodies";
import { BaseApi } from "shared/api/lib";
import api from "shared/config/axios";

export class InventoryApi extends BaseApi {
    protected baseURL = "/inventory";

    async send(body: InventoryRequestBody) {
        try {
            await api.post(this.baseURL, body, {
                headers: { Authorization: `Bearer: ${auth.getToken()}` },
            });
        } catch (error) {
            throw this.handleError(error);
        }
    }
}
