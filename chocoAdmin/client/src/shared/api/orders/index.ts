import { Order } from "entities";
import { UpdateOrderRequestBody } from "services/request-bodies";
import { ModelApi } from "shared/api/lib";

export class OrdersApi extends ModelApi<Order, UpdateOrderRequestBody> {
    protected override baseURL = "/orders";
}
