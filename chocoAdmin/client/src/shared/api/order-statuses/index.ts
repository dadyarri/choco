import { OrderStatus } from "entities";
import { ModelApi } from "shared/api/lib";

export class OrderStatusesApi extends ModelApi<OrderStatus, never> {
    protected override baseURL = "/orderStatuses";
}
