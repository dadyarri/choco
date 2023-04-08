import { OrderCity } from "entities";
import { ModelApi } from "shared/api/lib";

export class OrderCitiesApi extends ModelApi<OrderCity, never> {
    protected override baseURL = "/orderCities";
}
