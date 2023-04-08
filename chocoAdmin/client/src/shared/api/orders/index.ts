import { Order } from "entities";
import { UpdateOrderRequestBody } from "services/request-bodies";
import { Api } from "shared/api/lib";

export class OrdersApi extends Api<Order, UpdateOrderRequestBody> {
  protected override baseURL = "/orders";
}
